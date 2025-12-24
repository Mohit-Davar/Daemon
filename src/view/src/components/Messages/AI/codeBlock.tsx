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
        className="bg-[var(--bg-editor)] p-1 border border-[var(--vscode-widget-border)] rounded font-mono text-sm"
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-4 rounded-md w-full overflow-hidden">
      <div className="flex justify-between items-center bg-[var(--bg-editor)] px-4 py-2 font-mono text-xs">
        <span>{match[1]}</span>
        <CopyButton content={codeString} />
      </div>

      <SyntaxHighlighter
        PreTag="div"
        language={match[1]}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'var(--bg-editor)',
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
