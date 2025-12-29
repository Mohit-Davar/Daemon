import { User } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { CopyButton } from '@/components/ui/copy-button';
import { markdownComponents } from '@/features/chat/components/markdown-components';
import type { Message } from '@/types';

function AIMessage({ msg }: { msg: Message }) {
  return (
    <div className="mx-2 overflow-hidden">
      <div className="prose-invert text-[var(--fg-editor)] leading-relaxed prose">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {msg.text}
        </Markdown>
      </div>
    </div>
  );
}

function UserMessage({ msg }: { msg: Message }) {
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

export function MessageItem({ msg }: { msg: Message }) {
  if (msg.sender === 'assistant') {
    return <AIMessage msg={msg} />;
  }
  return <UserMessage msg={msg} />;
}
