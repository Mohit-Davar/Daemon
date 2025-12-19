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
            className="hover:bg-[var(--vscode-button-secondaryHoverBackground)] p-1 border border-[var(--vscode-widget-border)] rounded-lg text-[var(--fg-editor)] transition cursor-pointer"
            aria-label={copied ? 'Copied' : 'Copy content'}
        >
            {copied ? (
                <Check size={10} />
            ) : (
                <Copy size={10} />
            )}
        </button>
    );
}