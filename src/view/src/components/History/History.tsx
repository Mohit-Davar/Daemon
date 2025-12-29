import { ChevronRight, MessageCircleDashedIcon } from 'lucide-react';

import { formatRelativeDate } from '@/components/History/utils';
import { useChatStore } from '@/store/chat';
import type { Convo } from '@/store/type';
import { useUIStore } from '@/store/ui';

export function History() {
  const historyOpen = useUIStore((s) => s.historyOpen);
  const toggleHistory = useUIStore((s) => s.toggleHistory);

  const convos = useChatStore((s) => s.convos);
  const activeID = useChatStore((s) => s.activeID);
  const setActiveConvo = useChatStore((s) => s.setActiveConvo);

  const sorted = [...convos].sort(
    (a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime(),
  );

  return (
    <div
      className={`fixed inset-x-0 top-0 w-full max-h-64 bg-[var(--bg-editor)] shadow-2xl z-50 transform transition-transform duration-300 ${historyOpen ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="px-2 pb-2 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="p-4 text-[var(--secondary-fg)] text-sm text-center">
            No conversations yet.
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((convo: Convo) => {
              const isActive = activeID === convo.id;
              return (
                <button
                  key={convo.id}
                  onClick={() => {
                    setActiveConvo(convo.id);
                    toggleHistory();
                  }}
                  className={`w-full cursor-pointer flex items-center gap-3 p-3 rounded-md text-sm transition-all group
                      ${
                        isActive
                          ? 'bg-[var(--vscode-list-activeSelectionBackground)] text-[var(--vscode-list-activeSelectionForeground)]'
                          : 'hover:bg-[var(--hover-bg)]'
                      }`}
                >
                  <MessageCircleDashedIcon size={16} className="shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="truncate">{convo.title || 'New Conversation'}</div>
                    <div className="text-[var(--secondary-fg)] text-xs">
                      {formatRelativeDate(convo.updatedAt)}
                    </div>
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-60" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
