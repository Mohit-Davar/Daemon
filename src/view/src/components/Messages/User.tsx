import { User } from 'lucide-react';

import { CopyButton } from '@/components/UI/CopyButton';
import type { Message } from '@/store/type';

export function UserMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex justify-end w-full">
      <div className="group flex flex-row-reverse gap-3">
        {/* Avatar */}
        <div className="flex justify-center items-center bg-[var(--vscode-button-background)] rounded-full w-8 h-8 shrink-0">
          <User size={16} className="text-white" />
        </div>

        {/* Bubble */}
        <div className="relative">
          <div className="bg-[var(--vscode-button-secondaryBackground)] p-4 border border-[var(--border-color)] rounded-full rounded-tr-sm text-[var(--fg-editor)]">
            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          </div>

          {/* Actions */}
          <div className="top-1 right-full absolute opacity-0 group-hover:opacity-100 mr-2 transition-opacity">
            <CopyButton content={msg.text} />
          </div>
        </div>
      </div>
    </div>
  );
}
