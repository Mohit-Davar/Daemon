import { useState } from 'react';

import { Bot, Check, Copy, User } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { markdownComponents } from '@/features/chat/components/markdown-components';
import type { Message } from '@/types';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1 opacity-40">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground"
          style={{ animation: `dot-pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) ${i * 0.2}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

function AIMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex gap-3 px-1">
      <div className="shrink-0 w-7 h-7 rounded-md bg-muted border border-border flex items-center justify-center">
        <Bot size={14} className="text-foreground" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
          Daemon
        </div>
        <div className="prose prose-sm prose-invert max-w-none text-foreground leading-relaxed">
          {!msg.text ? (
            <TypingIndicator />
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {msg.text}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end px-1">
      <div className="group flex gap-2 max-w-[85%]">
        <button
          onClick={handleCopy}
          className="self-start mt-2 p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted transition-all"
          title="Copy message"
        >
          {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
        </button>

        <div className="bg-muted border border-border px-3 py-2 rounded-xl rounded-tr-sm text-sm text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
        </div>

        <div className="shrink-0 w-7 h-7 rounded-md bg-muted border border-border flex items-center justify-center">
          <User size={14} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export function MessageItem({ msg }: { msg: Message }) {
  if (msg.sender === 'assistant') return <AIMessage msg={msg} />;
  return <UserMessage msg={msg} />;
}
