import { create } from 'zustand';
import type { User } from '@/types';
import { VSCode } from '@/lib/vscode';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: () => {
    VSCode.postMessage({ command: 'login' });
  },
  logout: () => {
    VSCode.postMessage({ command: 'logout' });
    set({ user: null });
  },
}));
