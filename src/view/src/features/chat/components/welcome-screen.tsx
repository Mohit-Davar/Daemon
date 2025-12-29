import { Sparkles } from 'lucide-react';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col justify-center items-center p-8 h-full overflow-y-auto text-center animate-in duration-500 fade-in zoom-in">
      <div className="flex justify-center items-center bg-[var(--vscode-button-secondaryBackground)] shadow-lg mb-6 rounded-2xl w-16 h-16">
        <Sparkles size={32} className="text-[var(--vscode-button-foreground)]" />
      </div>
      <h3 className="mb-2 font-semibold text-2xl">Welcome to Daemon</h3>
      <p className="max-w-md text-[var(--secondary-fg)] text-base leading-relaxed">
        I can help you analyze code, explain concepts, or refactor your project. Select a
        conversation or type a message to get started.
      </p>
    </div>
  );
}
