import { create } from 'zustand';

import type { ChatState } from '@/store/type';

const vscode = acquireVsCodeApi();

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  query: '',
  loading: false,

  setQuery: (query) => set({ query }),
  setLoading: (loading) => set({ loading }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  appendToken: (token) =>
    set((state) => {
      const lastIndex = state.messages.length - 1;
      const lastMsg = state.messages[lastIndex];

      if (!lastMsg || lastMsg.sender !== 'ai') return state;

      // clone only what is needed
      const messages = state.messages.slice();
      messages[lastIndex] = {
        ...lastMsg,
        text: lastMsg.text + token,
      };

      return { messages: messages };
    }),

  sendQuery: () => {
    const { query } = get();

    // user message
    set((state) => ({
      messages: [
        ...state.messages,
        { text: query, sender: 'user' },
        { text: '', sender: 'ai' },
      ],
      query: '',
      loading: true,
    }));

    vscode.postMessage({
      command: 'query',
      text: query,
    });
  }
}));


window.addEventListener('message', (event) => {
  const { text, command } = event.data;

  const store = useChatStore.getState();
  switch (command) {
    case 'stream':
      store.appendToken(text);
      break;
    case 'done':
      store.setLoading(false);
      break;
    case 'error':
      console.error(text);
      break;
  }
});
