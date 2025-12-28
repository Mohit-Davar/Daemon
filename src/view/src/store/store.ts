import { create } from 'zustand';

import type { Convo, ConvoStore } from '@/store/type';
import { vscode } from '@/vscode';

const generateId = () => crypto.randomUUID();

export const useChatStore = create<ConvoStore>((set, get) => ({
  query: '',
  loading: false,
  convos: [],
  activeConvoID: null,

  setQuery: (query) => set({ query }),

  setActiveConvo: (id) => set({ activeConvoID: id }),

  createConvo: () => {
    const id = generateId();

    const newConvo: Convo = {
      id,
      title: 'New Conversation',
      messages: [],
    };

    set((state) => ({ convos: [newConvo, ...state.convos] }));

    return id;
  },

  sendQuery: () => {
    const { query, activeConvoID } = get();
    if (!query.trim() || !activeConvoID) return;

    set((state) => ({
      loading: true,
      query: '',
      convos: state.convos.map((convo) =>
        convo.id !== activeConvoID
          ? convo
          : {
              ...convo,
              messages: [
                ...convo.messages,
                { id: generateId(), sender: 'user', text: query },
                { id: generateId(), sender: 'ai', text: '' },
              ],
            },
      ),
    }));

    vscode.postMessage({
      command: 'query',
      data: { query, activeConvoID },
    });
  },

  appendToken: (token: string) => {
    const { activeConvoID } = get();
    if (!activeConvoID) return;

    set((state) => ({
      convos: state.convos.map((convo) =>
        convo.id !== activeConvoID
          ? convo
          : {
              ...convo,
              messages: convo.messages.map((msg, idx) =>
                idx === convo.messages.length - 1 && msg.sender === 'ai'
                  ? { ...msg, text: msg.text + token }
                  : msg,
              ),
            },
      ),
    }));
  },

  finishStream: () => set({ loading: false }),
}));

window.addEventListener('message', (event) => {
  const { command, text, id } = event.data;
  const store = useChatStore.getState();

  switch (command) {
    case 'stream':
      store.appendToken(text);
      break;
    case 'done':
      store.finishStream();
      break;
    case 'change':
      store.setActiveConvo(id);
      break;
    case 'error':
      console.error(text);
      break;
    default:
      // ignore unknown commands
      break;
  }
});
