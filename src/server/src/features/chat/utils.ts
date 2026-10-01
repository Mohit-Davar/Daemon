import dotenv from 'dotenv';
import OpenAI from 'openai';

import { ChatMessage } from '@/features/chat/types';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert AI coding assistant embedded directly inside VS Code.
You help developers write, debug, explain, and refactor code.
- Always respond in clear, concise markdown.
- When providing code, use fenced code blocks with the correct language identifier.
- If the user shares file context, use it to give accurate, relevant answers.
- Be direct and pragmatic — developers value clarity over verbosity.
- If you don't know something, say so clearly rather than guessing.`;

export async function* callLLM(messages: ChatMessage[], editorContext?: string) {
  const systemMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Inject editor context as a second system message so the AI knows what file is open
  if (editorContext) {
    systemMessages.push({
      role: 'system',
      content: `The user currently has the following file open in their editor:\n\n${editorContext}\n\nUse this as context when answering their questions.`,
    });
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      ...systemMessages,
      ...messages,
    ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      yield token;
    }
  }
}
