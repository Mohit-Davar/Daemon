import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { markdownComponents } from '@/components/Messages/AI/markdownComponents';
import type { Message } from '@/store/type';

export function AIMessage({ msg }: { msg: Message }) {
  return (
    <div className="p-3 w-full">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents}
      >
        {msg.text}
      </Markdown>
    </div>
  );
}
