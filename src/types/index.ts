export type Sender = 'user' | 'assistant';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
}

export interface Convo {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface WebviewMessage {
  command: string;
  data?: unknown;
  text?: string;
}

export interface LLMMessage {
  role: Sender;
  content: string;
}
