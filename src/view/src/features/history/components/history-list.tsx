import { useState, useRef } from 'react';
import { ChevronRight, Pencil, Trash2, Check, X, Search } from 'lucide-react';

import { useChatStore } from '@/features/chat/store/chat-store';
import { formatRelativeDate } from '@/features/history/lib/date-utils';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import type { Convo } from '@/types';

function ConvoItem({
  convo,
  isActive,
  onSelect,
}: {
  convo: Convo;
  isActive: boolean;
  onSelect: () => void;
}) {
  const deleteConvo = useChatStore((s) => s.deleteConvo);
  const renameConvo = useChatStore((s) => s.renameConvo);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(convo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(convo.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const commitRename = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== convo.title) {
      renameConvo(convo.id, trimmed);
    }
    setEditing(false);
  };

  const cancelRename = () => {
    setDraft(convo.title);
    setEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConvo(convo.id);
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg w-full text-sm transition-all cursor-pointer border-l-2',
        isActive
          ? 'bg-brand/5 border-brand text-brand font-semibold'
          : 'hover:bg-bg-subtle/50 border-transparent',
      )}
      onClick={() => {
        if (!editing) onSelect();
      }}
    >
      <div className="flex-1 min-w-0 text-left">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') cancelRename();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-bg-editor border border-brand/50 rounded px-2 py-0.5 text-xs outline-none"
            autoFocus
          />
        ) : (
          <>
            <div className="truncate text-xs tracking-tight">
              {convo.title || 'Untitled Session'}
            </div>
            <div className="text-[10px] text-secondary-fg/60 font-medium uppercase mt-0.5">
              {formatRelativeDate(convo.updatedAt)}
            </div>
          </>
        )}
      </div>

      <div
        className={cn(
          'flex items-center gap-0.5 shrink-0 transition-opacity',
          editing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {editing ? (
          <>
            <button
              onClick={commitRename}
              className="p-1 rounded hover:bg-green-500/10 text-green-500"
              title="Save"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelRename}
              className="p-1 rounded hover:bg-bg-subtle text-secondary-fg"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={startEdit}
              className="p-1 rounded hover:bg-bg-subtle text-secondary-fg hover:text-fg-editor"
              title="Rename"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-red-500/10 text-secondary-fg hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>

      {isActive && !editing && <ChevronRight size={12} className="opacity-30 shrink-0" />}
    </div>
  );
}

export function HistoryList() {
  const historyOpen = useUIStore((s) => s.historyOpen);
  const toggleHistory = useUIStore((s) => s.toggleHistory);

  const convos = useChatStore((s) => s.convos);
  const activeID = useChatStore((s) => s.activeID);
  const setActiveConvo = useChatStore((s) => s.setActiveConvo);

  const [search, setSearch] = useState('');

  const filtered = [...convos]
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());

  return (
    <div
      className={cn(
        'top-0 z-50 fixed inset-x-0 bg-editor border-b border-border shadow-2xl w-full transition-all duration-300 transform',
        historyOpen
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none',
      )}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-fg/60">
            Session History
          </div>
          <button
            onClick={toggleHistory}
            className="p-1.5 hover:bg-bg-subtle rounded-md text-secondary-fg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-fg/30"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg-subtle/30 border border-border text-xs outline-none focus:border-brand/50 transition-all"
          />
        </div>

        <div className="overflow-y-auto max-h-[50vh] space-y-1 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-secondary-fg/40 text-[11px] text-center uppercase tracking-widest font-bold">
              Empty
            </div>
          ) : (
            filtered.map((convo: Convo) => (
              <ConvoItem
                key={convo.id}
                convo={convo}
                isActive={activeID === convo.id}
                onSelect={() => {
                  setActiveConvo(convo.id);
                  toggleHistory();
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
