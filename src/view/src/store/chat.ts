import { create } from 'zustand';

import type { ChatStore, Convo } from '@/store/type';
import { useUIStore } from '@/store/ui';
import { vscode } from '@/vscode';

const id = () => crypto.randomUUID();

export const useChatStore = create<ChatStore>((set, get) => ({
  query: '',
  convos: [],
  activeID: null,

  setQuery: (query) => set({ query }),
  setConvos: (convos) => set({ convos }),
  setActiveConvo: (id) => set({ activeID: id }),

  createConvo: () => {
    const convo: Convo = {
      id: id(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((s) => ({ convos: [convo, ...s.convos] }));
    return convo.id;
  },

  sendQuery: () => {
    const { query, activeID, convos } = get();
    if (!query.trim() || !activeID) return;

    const convo = convos.find((c) => c.id === activeID);
    if (!convo) return;

    const userMsg = { id: id(), sender: 'user' as const, text: query };
    const aiMsg = { id: id(), sender: 'assistant' as const, text: '' };

    useUIStore.getState().toggleLoading();

    // Update UI optimistically
    set((s) => ({
      query: '',
      convos: s.convos.map((c) =>
        c.id !== activeID
          ? c
          : {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, userMsg, aiMsg],
            },
      ),
    }));

    const isNewConvo = convo.messages.length === 0;

    vscode.postMessage({
      command: 'query',
      data: {
        convo: isNewConvo
          ? {
              id: convo.id,
              title: convo.title,
              createdAt: convo.createdAt,
              updatedAt: convo.updatedAt,
            }
          : { id: convo.id },
        messages: [userMsg, aiMsg],
      },
    });
  },

  appendToken: (token) => {
    const { activeID } = get();
    if (!activeID) return;

    set((s) => ({
      convos: s.convos.map((c) => {
        if (c.id !== activeID) return c;

        const last = c.messages.at(-1);
        if (!last || last.sender !== 'assistant') return c;

        return {
          ...c,
          messages: [...c.messages.slice(0, -1), { ...last, text: last.text + token }],
        };
      }),
    }));
  },
}));
