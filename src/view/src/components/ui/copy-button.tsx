import { useState } from 'react';

import { Check, Copy } from 'lucide-react';

export function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-md text-[var(--secondary-fg)] transition-colors cursor-pointer"
      aria-label={copied ? 'Copied' : 'Copy content'}
      title={copied ? 'Copied' : 'Copy'}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
}
