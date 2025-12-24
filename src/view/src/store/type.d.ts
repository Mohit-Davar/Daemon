export interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export interface ChatState {
  messages: Message[];
  query: string;
  loading: boolean;

  setQuery: (query: string) => void;
  addMessage: (message: Message) => void;
  appendToken: (token: text) => void;
  sendQuery: () => void;
  setLoading: (loading: boolean) => void;
}
