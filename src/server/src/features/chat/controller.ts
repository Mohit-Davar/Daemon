import { Request, Response } from 'express';

import { ChatMessage } from '@/features/chat/types';
import { callLLM } from '@/features/chat/utils';

export const handleChat = async (req: Request, res: Response) => {
  const messages: ChatMessage[] = req.body.messages;
  if (!messages) {
    return res.status(400).json({ error: 'Missing messages in request body.' });
  }

  // Streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = callLLM(messages);
    for await (const token of stream) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ token: '[DONE]' })}\n\n`);
  } catch (error) {
    console.error('LLM stream error', error);
    res.write(`data: ${JSON.stringify({ token: '[ERROR]' })}\n\n`);
  } finally {
    res.end();
  }
};
