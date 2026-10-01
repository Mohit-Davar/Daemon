import { useRef } from 'react';

import { SendHorizontal } from 'lucide-react';

import { ContextBadge } from '@/features/chat/components/context-badge';
import { handleGrow, handleSend } from '@/features/chat/lib/input-handlers';
import { useChatStore } from '@/features/chat/store/chat-store';
import { useUIStore } from '@/store/ui-store';

export function ChatInput() {
  const query = useChatStore((state) => state.query);
  const setQuery = useChatStore((state) => state.setQuery);
  const sendQuery = useChatStore((state) => state.sendQuery);
  const loading = useUIStore((state) => state.loading);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSend = () => {
    if (query.trim() && !loading) {
      handleSend(loading, textareaRef, sendQuery);
    }
  };

  return (
    <div className="p-3">
      <ContextBadge />

      <div className="relative flex flex-col bg-muted/40 border border-border rounded-xl overflow-hidden focus-within:border-muted-foreground/40 transition-colors">
        <textarea
          ref={textareaRef}
          rows={1}
          value={query}
          placeholder="Ask anything..."
          onChange={(e) => {
            setQuery(e.target.value);
            handleGrow(textareaRef);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="w-full p-3 pr-12 bg-transparent outline-none text-sm leading-relaxed resize-none min-h-11 max-h-40 text-foreground placeholder:text-muted-foreground/50"
        />

        <div className="absolute bottom-2 right-2">
          <button
            onClick={onSend}
            disabled={!query.trim() || loading}
            title="Send"
            className="p-1.5 bg-foreground text-background rounded-lg disabled:opacity-25 transition-opacity flex items-center justify-center"
          >
            <SendHorizontal size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
