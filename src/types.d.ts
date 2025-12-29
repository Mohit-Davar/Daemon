export type Sender = 'user' | 'assistant';

export type Message = {
  id: string;
  sender: Sender;
  text: string;
};

export type Convo = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

interface WebviewMessage {
  command: string;
  data?: unknown;
}
