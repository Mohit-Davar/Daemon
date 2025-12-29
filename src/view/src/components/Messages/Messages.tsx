import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ArrowDown, Sparkles } from 'lucide-react';

import { AIMessage } from '@/components/Messages/AI/AI';
import { UserMessage } from '@/components/Messages/User';
import { useChatStore } from '@/store/chat';

export function MessageList() {
  const convos = useChatStore((state) => state.convos);
  const activeID = useChatStore((state) => state.activeID);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const activeConvo = convos.find((c) => c.id === activeID);
  const messages = activeConvo ? activeConvo.messages : [];

  // Reset auto-scroll when switching conversations
  useEffect(() => {
    setAutoScroll(true);
  }, [activeID]);

  // Scroll to bottom logic
  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Auto-scroll effect
  useLayoutEffect(() => {
    if (autoScroll) {
      scrollToBottom('smooth');
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (isAtBottom) {
      setAutoScroll(true);
      setShowScrollButton(false);
    } else {
      setAutoScroll(false);
      setShowScrollButton(true);
    }
  };

  if (!activeID || !messages.length) {
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

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-col gap-6 p-4 w-full h-full overflow-y-auto scroll-smooth"
      >
        <div className="flex flex-col gap-6 mx-auto pb-4 w-full max-w-4xl">
          {messages.map((msg) =>
            msg.sender === 'assistant' ? (
              <AIMessage key={msg.id} msg={msg} />
            ) : (
              <UserMessage key={msg.id} msg={msg} />
            ),
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={() => {
            setAutoScroll(true);
            scrollToBottom('smooth');
          }}
          className="right-4 bottom-4 slide-in-from-bottom-2 z-10 absolute bg-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-hoverBackground)] shadow-lg p-2 rounded-full text-[var(--vscode-button-foreground)] transition-all animate-in fade-in"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
}
