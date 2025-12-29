import type { Components } from 'react-markdown';

import { atomOneDark, SyntaxHighlighter } from '@/components/Messages/AI/syntaxHighlighter';
import { CopyButton } from '@/components/UI/CopyButton';

type CodeProps = NonNullable<Components['code']>;

export const CodeBlock: CodeProps = ({ children, className, ...rest }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeString = String(children ?? '').replace(/\n$/, '');

  if (!match) {
    return (
      <code
        {...rest}
        className="bg-[var(--vscode-textCodeBlock-background)] px-1.5 py-0.5 border border-[var(--border-color)] rounded-md font-mono text-[var(--vscode-textPreformat-foreground)] text-sm"
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 border border-[var(--border-color)] rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-[var(--vscode-editor-inactiveSelectionBackground)] px-3 py-1.5 border-[var(--border-color)] border-b font-mono text-[var(--secondary-fg)] text-xs">
        <span className="font-semibold">{match[1]}</span>
        <CopyButton content={codeString} />
      </div>

      <SyntaxHighlighter
        PreTag="div"
        language={match[1]}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'var(--vscode-editor-background)',
          fontSize: '0.875rem',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            background: 'transparent',
          },
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
