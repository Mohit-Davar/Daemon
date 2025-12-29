import { ArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ScrollButtonProps {
  onClick: () => void;
  show: boolean;
}

export function ScrollToBottomButton({ onClick, show }: ScrollButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'right-4 bottom-4 slide-in-from-bottom-2 z-10 absolute bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] shadow-lg p-2 rounded-full text-[var(--vscode-button-foreground)] transition-all animate-in cursor-pointer fade-in',
      )}
    >
      <ArrowDown size={20} />
    </button>
  );
}
