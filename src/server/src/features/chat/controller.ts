import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { ChatMessage } from '@/features/chat/types';
import { callLLM } from '@/features/chat/utils';

// ─── Streaming Chat ────────────────────────────────────────────────────────────

/**
 * POST /api/chat
 * Body: { messages: ChatMessage[], convoId?: string, convoTitle?: string, context?: string }
 *
 * Streams AI tokens back as SSE and persists the exchange to Postgres.
 */
export const handleChat = async (req: Request, res: Response) => {
  const userId = req.user!;
  const {
    messages: msgs,
    convoId,
    convoTitle,
    context,
  } = req.body as {
    messages: ChatMessage[];
    convoId?: string;
    convoTitle?: string;
    context?: string;
  };

  if (!msgs || !Array.isArray(msgs) || msgs.length === 0) {
    return res.status(400).json({ error: 'Missing or empty messages array.' });
  }

  // ── Set up SSE ──────────────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // ── Resolve or create conversation ─────────────────────────────────────────
  let resolvedConvoId: string | undefined = convoId;

  try {
    if (convoId) {
      // Verify the conversation belongs to this user
      const existing = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, convoId))
        .limit(1);

      if (!existing[0] || existing[0].userId !== userId) {
        // Conversation not found for this user — create a fresh one
        resolvedConvoId = undefined;
      }
    }

    if (!resolvedConvoId) {
      const [newConvo] = await db
        .insert(conversations)
        .values({
          userId,
          title: convoTitle ?? 'New Conversation',
        })
        .returning();
      resolvedConvoId = newConvo.id;
      // Tell the client the server-assigned convo ID
      res.write(`data: ${JSON.stringify({ convoId: resolvedConvoId })}\n\n`);
    }

    // ── Persist the user message ──────────────────────────────────────────────
    const userMsg = msgs.findLast((m: ChatMessage) => m.role === 'user');
    if (userMsg) {
      await db.insert(messages).values({
        convoId: resolvedConvoId,
        sender: 'user',
        text: userMsg.content,
      });
    }

    // ── Stream AI response ────────────────────────────────────────────────────
    let assistantText = '';
    const stream = callLLM(msgs, context);

    for await (const token of stream) {
      assistantText += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }

    // ── Persist assistant message ─────────────────────────────────────────────
    if (assistantText) {
      await db.insert(messages).values({
        convoId: resolvedConvoId,
        sender: 'assistant',
        text: assistantText,
      });
    }

    // ── Update conversation updatedAt ─────────────────────────────────────────
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, resolvedConvoId));

    res.write(`data: ${JSON.stringify({ token: '[DONE]' })}\n\n`);
  } catch (error) {
    console.error('[Chat] Stream error', error);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ token: '[ERROR]' })}\n\n`);
    }
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
  return;
};

// ─── Conversation Management ───────────────────────────────────────────────────

/** GET /api/conversations — all conversations for the authed user */
export const getConversations = async (req: Request, res: Response) => {
  const userId = req.user!;
  try {
    const convos = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(conversations.updatedAt);
    return res.json(convos);
  } catch (e) {
    console.error('[Chat] Fetch conversations failed', e);
    return res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

/** DELETE /api/conversations/:id */
export const deleteConversation = async (req: Request, res: Response) => {
  const userId = req.user!;
  const { id } = req.params;
  try {
    const convo = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);

    if (!convo[0] || convo[0].userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete messages first (FK constraint)
    await db.delete(messages).where(eq(messages.convoId, id));
    await db.delete(conversations).where(eq(conversations.id, id));

    return res.json({ success: true });
  } catch (e) {
    console.error('[Chat] Delete conversation failed', e);
    return res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

/** PATCH /api/conversations/:id — rename */
export const renameConversation = async (req: Request, res: Response) => {
  const userId = req.user!;
  const { id } = req.params;
  const { title } = req.body as { title: string };

  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const convo = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);

    if (!convo[0] || convo[0].userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db
      .update(conversations)
      .set({ title: title.trim(), updatedAt: new Date() })
      .where(eq(conversations.id, id));

    return res.json({ success: true });
  } catch (e) {
    console.error('[Chat] Rename conversation failed', e);
    return res.status(500).json({ error: 'Failed to rename conversation' });
  }
};

/** GET /api/conversations/:id/messages */
export const getMessages = async (req: Request, res: Response) => {
  const userId = req.user!;
  const { id } = req.params;
  try {
    const convo = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);

    if (!convo[0] || convo[0].userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const msgs = await db.select().from(messages).where(eq(messages.convoId, id));
    return res.json(msgs);
  } catch (e) {
    console.error('[Chat] Fetch messages failed', e);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
