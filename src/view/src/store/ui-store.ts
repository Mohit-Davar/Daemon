import { create } from 'zustand';
import type { UIStore } from '@/types';

export const useUIStore = create<UIStore>((set) => ({
  historyOpen: false,
  loading: false,
  error: null,
  activeFile: null,

  toggleLoading: () => set((s) => ({ loading: !s.loading })),
  toggleHistory: () => set((s) => ({ historyOpen: !s.historyOpen })),
  setError: (error) => set({ error }),
  setActiveFile: (ctx) => set({ activeFile: ctx }),
}));
