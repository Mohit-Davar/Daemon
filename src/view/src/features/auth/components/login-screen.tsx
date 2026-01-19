import { Github } from 'lucide-react';
import { Auth } from '@/features/auth/components/auth';

export function LoginScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-gradient-to-br from-[var(--bg-editor)] to-[var(--bg-editor)]/80">
      <div className="max-w-md space-y-8 glass p-8 rounded-2xl shadow-2xl border-white/5">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Github className="w-8 h-8 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-white">Daemon</h1>
            <p className="text-muted-foreground text-lg">Your AI-powered development assistant.</p>
          </div>
        </div>

        <div className="pt-4">
          <Auth />
        </div>

        <div className="pt-8 grid grid-cols-2 gap-4 text-xs text-white/40">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            AI Powered
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Vite Fast
          </div>
        </div>
      </div>
    </div>
  );
}
