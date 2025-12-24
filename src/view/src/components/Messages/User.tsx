import { CopyButton } from '@/components/UI/CopyButton';
import type { Message } from '@/store/type';

export function UserMessage({ msg }: { msg: Message }) {
  return (
    <div className="relative flex flex-col items-end">
      <div className="bg-[var(--bg-editor)] p-3 rounded-lg max-w-lg text-[var(--fg-editor)] break-words">
        {msg.text}
      </div>
      <div className="mt-2 w-fit">
        <CopyButton content={msg.text} />
      </div>
    </div>
  );
}
