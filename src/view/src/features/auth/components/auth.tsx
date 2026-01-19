import { Github, LogOut } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/auth-store';

export function Auth() {
  const { user, login, logout } = useAuthStore();

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      {user ? (
        <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-full">
          <div className="relative group">
            <img
              src={user.photo}
              alt={user.displayName}
              className="w-7 h-7 rounded-full border border-white/20 shadow-sm transition-transform group-hover:scale-110"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--bg-editor)] rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-none">{user.displayName}</span>
            <span className="text-[10px] text-white/50 leading-none mt-0.5">Online</span>
          </div>
          <button
            onClick={logout}
            className="ml-2 p-1.5 rounded-md hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      ) : (
        <button onClick={login} className="btn-primary">
          <Github size={18} />
          Sign in with GitHub
        </button>
      )}
    </div>
  );
}
