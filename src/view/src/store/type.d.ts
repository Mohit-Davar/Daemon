export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Convo {
  id: string;
  title: string;
  messages: Message[];
}

export interface ConvoStore {
  query: string;
  loading: boolean;
  convos: Convo[];
  activeConvoID: string | null;

  setQuery(query: string): void;
  setActiveConvo(id: string): void;

  createConvo(): string;
  sendQuery(): void;

  appendToken(token: string): void;
  finishStream(): void;
}
