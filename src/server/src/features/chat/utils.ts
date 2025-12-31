import dotenv from 'dotenv';
import Groq from 'groq-sdk';

import { ChatMessage } from '@/features/chat/types';

dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function* callLLM(messages: ChatMessage[]) {
  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      yield token;
    }
  }
}
