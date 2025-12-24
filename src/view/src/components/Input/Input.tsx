import { useRef } from 'react';

import { ArrowUp, Plus } from 'lucide-react';

import { handleGrow, handleSend } from '@/components/Input/handlers';
import { useChatStore } from '@/store/store';

export function ChatInput() {
  const query = useChatStore((state) => state.query);
  const loading = useChatStore((state) => state.loading);
  const setQuery = useChatStore((state) => state.setQuery);
  const sendQuery = useChatStore((state) => state.sendQuery);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="bg-[var(--bg-editor)] shadow-lg backdrop-blur-md m-3 p-3 border border-[var(--vscode-widget-border)] rounded-xl">
      {/* TEXTAREA */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={query}
        placeholder="How can I help?"
        onChange={(e) => {
          setQuery(e.target.value);
          handleGrow(textareaRef);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(loading, textareaRef, sendQuery);
          }
        }}
        className="bg-transparent outline-none w-full overflow-y-auto text-[var(--fg-editor)] placeholder:text-[var(--vscode-input-placeholderForeground)] text-sm leading-relaxed resize-none"
      />

      {/* BUTTONS */}
      <div className="flex justify-between items-center mt-2">
        {/* ADD FILE */}
        <button className="hover:bg-[var(--vscode-button-secondaryHoverBackground)] p-1 border border-[var(--vscode-widget-border)] rounded-lg text-[var(--fg-editor)] transition cursor-pointer">
          <Plus size={16} />
        </button>

        {/* SEND MESSAGE */}
        <button
          onClick={() => {
            handleSend(loading, textareaRef, sendQuery);
          }}
          disabled={!query.trim() || loading}
          className="bg-[var(--vscode-button-secondaryBackground)] hover:bg-[var(--vscode-button-hoverBackground)] disabled:opacity-40 p-1 rounded-full text-[var(--fg-editor)] transition cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
