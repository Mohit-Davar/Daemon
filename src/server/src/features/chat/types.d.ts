export type Sender = 'user' | 'assistant';

export interface ChatMessage {
  role: Sender;
  content: string;
}
