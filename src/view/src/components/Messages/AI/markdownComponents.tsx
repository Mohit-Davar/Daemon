import type { Components } from 'react-markdown';

import { CodeBlock } from '@/components/Messages/AI/codeBlock';

export const markdownComponents: Components = {
  code: CodeBlock,

  p({ children }) {
    return <p className="mb-4 last:mb-0 text-[var(--fg-editor)] leading-7">{children}</p>;
  },

  ul({ children }) {
    return (
      <ul className="space-y-1 mb-4 ml-4 marker:text-[var(--secondary-fg)] list-disc">
        {children}
      </ul>
    );
  },

  ol({ children }) {
    return (
      <ol className="space-y-1 mb-4 ml-4 marker:text-[var(--secondary-fg)] list-decimal">
        {children}
      </ol>
    );
  },

  li({ children }) {
    return <li className="leading-7">{children}</li>;
  },

  h1({ children }) {
    return <h1 className="mt-6 mb-4 font-bold text-2xl tracking-tight">{children}</h1>;
  },

  h2({ children }) {
    return <h2 className="mt-5 mb-3 font-semibold text-xl tracking-tight">{children}</h2>;
  },

  h3({ children }) {
    return <h3 className="mt-4 mb-2 font-semibold text-lg">{children}</h3>;
  },

  h4({ children }) {
    return <h4 className="mt-3 mb-2 font-medium text-base">{children}</h4>;
  },

  h5({ children }) {
    return <h5 className="mt-3 mb-1 font-medium text-sm uppercase">{children}</h5>;
  },

  h6({ children }) {
    return <h6 className="mt-2 mb-1 text-[var(--secondary-fg)] text-xs uppercase">{children}</h6>;
  },

  blockquote({ children }) {
    return (
      <blockquote className="my-4 pl-4 border-[var(--vscode-textBlockQuote-border)] border-l-4 text-[var(--secondary-fg)] italic">
        {children}
      </blockquote>
    );
  },

  table({ children }) {
    return (
      <div className="my-4 border border-[var(--border-color)] rounded-lg overflow-x-auto">
        <table className="divide-[var(--border-color)] divide-y min-w-full text-sm">
          {children}
        </table>
      </div>
    );
  },

  thead({ children }) {
    return (
      <thead className="bg-[var(--vscode-editor-inactiveSelectionBackground)]">{children}</thead>
    );
  },

  tbody({ children }) {
    return (
      <tbody className="bg-transparent divide-[var(--border-color)] divide-y">{children}</tbody>
    );
  },

  tr({ children }) {
    return (
      <tr className="transition-colors hover:bg-[var(--vscode-list-hoverBackground)]">
        {children}
      </tr>
    );
  },

  th({ children }) {
    return (
      <th className="px-4 py-3 font-semibold text-[var(--fg-editor)] text-left">{children}</th>
    );
  },

  td({ children }) {
    return <td className="px-4 py-3 text-[var(--fg-editor)]">{children}</td>;
  },

  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--vscode-textLink-foreground)] decoration-1 hover:underline underline-offset-2"
        {...props}
      >
        {children}
      </a>
    );
  },

  hr() {
    return <hr className="my-6 border-[var(--border-color)]" />;
  },

  strong({ children }) {
    return <strong className="font-semibold text-[var(--fg-editor)]">{children}</strong>;
  },

  em({ children }) {
    return <em className="text-[var(--fg-editor)] italic">{children}</em>;
  },

  del({ children }) {
    return <del className="text-[var(--secondary-fg)] line-through">{children}</del>;
  },

  pre({ children }) {
    return <>{children}</>;
  },

  img({ src, alt }) {
    return (
      <figure className="my-4">
        <img
          src={src ?? ''}
          alt={alt ?? ''}
          className="border border-[var(--border-color)] rounded-lg max-w-full"
        />
        {alt && (
          <figcaption className="mt-2 text-[var(--secondary-fg)] text-xs text-center">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  input({ checked, type }) {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="mr-2 accent-[var(--vscode-textLink-foreground)]"
        />
      );
    }
    return null;
  },

  kbd({ children }) {
    return (
      <kbd className="bg-[var(--vscode-textCodeBlock-background)] px-1.5 py-0.5 border rounded text-xs">
        {children}
      </kbd>
    );
  },

  sup({ children }) {
    return <sup className="text-xs">{children}</sup>;
  },

  sub({ children }) {
    return <sub className="text-xs">{children}</sub>;
  },
};
