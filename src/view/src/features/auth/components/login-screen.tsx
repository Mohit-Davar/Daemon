import { Github } from 'lucide-react';

import { Auth } from '@/features/auth/components/auth';

export function LoginScreen() {
  return (
    <div className="w-full h-screen p-3 flex items-center justify-center">
      <div className="w-full">
        <div className="bg-background border border-border rounded-xl p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center">
              <Github className="w-5 h-5 text-foreground" />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-lg font-semibold text-foreground mb-2">Welcome to Daemon</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your GitHub account to start using Daemon.
            </p>
          </div>

          <Auth />

          <p className="mt-5 text-xs text-muted-foreground/70 leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-muted-foreground underline underline-offset-2">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-muted-foreground underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-4">Daemon</p>
      </div>
    </div>
  );
}
