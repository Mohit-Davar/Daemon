import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { markdownComponents } from '@/components/Messages/AI/markdownComponents';
import type { Message } from '@/store/type';

export function AIMessage({ msg }: { msg: Message }) {
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
