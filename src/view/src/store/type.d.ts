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

export type ChatStore = {
  query: string;
  convos: Convo[];
  activeID: string | null;

  setQuery: (q: string) => void;
  sendQuery: () => void;

  setConvos: (convos: Convo[]) => void;
  createConvo: () => string;

  setActiveConvo: (id: string) => void;

  appendToken: (token: string) => void;
};

export type UIStore = {
  historyOpen: boolean;
  loading: boolean;

  toggleLoading: () => void;
  toggleHistory: () => void;
};
