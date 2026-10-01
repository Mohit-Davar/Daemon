import { Github, LogOut } from 'lucide-react';

import { useAuthStore } from '@/features/auth/store/auth-store';

export function Auth() {
  const { user, login, logout } = useAuthStore();

  if (!user) {
    return (
      <button onClick={login} className="btn-primary flex items-center gap-2">
        <Github className="w-6 h-6 text-foreground" />
        <span className="text-sm font-medium">Continue with GitHub</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2.5 bg-background border border-border rounded-md px-3 py-2">
      <div className="relative shrink-0">
        <img
          src={user.photo}
          alt={user.username}
          className="w-7 h-7 rounded-full border border-border"
        />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 border border-background rounded-full" />
      </div>

      <span className="text-sm font-medium text-foreground leading-none">{user.username}</span>

      <div className="w-px h-6 bg-border mx-0.5" />

      <button
        onClick={logout}
        title="Disconnect"
        className="flex items-center justify-center p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
}
