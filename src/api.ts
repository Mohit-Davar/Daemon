import Groq from 'groq-sdk';

export async function* queryLLM(
  apiKey: string,
  messages: Groq.Chat.Completions.ChatCompletionMessageParam[],
): AsyncGenerator<string> {
  const groq = new Groq({ apiKey });

  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    stream: true,
  });

  try {
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) {
        yield token;
      }
    }
  } catch (err) {
    console.error('Groq stream error', err);
  }
}
