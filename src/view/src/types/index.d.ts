export type User = {
  id: string;
  username: string;
  photo: string;
};

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
  deleteConvo: (id: string) => void;
  renameConvo: (id: string, title: string) => void;
};

export type ActiveFileContext = {
  fileName: string;
  languageId: string;
} | null;

export type UIStore = {
  historyOpen: boolean;
  loading: boolean;
  error: string | null;
  activeFile: ActiveFileContext;

  toggleLoading: () => void;
  toggleHistory: () => void;
  setError: (msg: string | null) => void;
  setActiveFile: (ctx: ActiveFileContext) => void;
};
