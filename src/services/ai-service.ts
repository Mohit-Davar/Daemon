import Groq from 'groq-sdk';

import { LLMMessage } from '@/types';

export class AIService {
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  public async *streamResponse(messages: LLMMessage[]): AsyncGenerator<string> {
    try {
      const stream = await this.groq.chat.completions.create({
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
    } catch (err) {
      console.error('Groq stream error', err);
      throw err;
    }
  }
}
