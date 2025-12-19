import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { CopyButton } from '@/components/UI/CopyButton';
import type { Message } from '@/store/type';

export function AIMessage({ msg }: { msg: Message }) {
    return (
        <div className="p-3 w-full">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        return match ? (
                            <div className="my-4 rounded-md w-full overflow-hidden">
                                <div className="flex justify-between items-center bg-[var(--bg-editor)] px-4 py-2 rounded-t-md w-full font-mono text-[var(--fg-editor)] text-xs">
                                    <span>{match[1]}</span>
                                    <CopyButton content={codeString} />
                                </div>
                                <div className="relative pb-2 rounded-b-md">
                                    <div className="overflow-x-auto">
                                        {/* @ts-expect-error IDK */}
                                        <SyntaxHighlighter
                                            {...rest}
                                            PreTag="div"
                                            language={match[1]}
                                            style={atomOneDark}
                                            customStyle={{
                                                margin: 0,
                                                padding: '1rem',
                                                background: 'bg-[var(--bg-editor)]',
                                                fontSize: '0.875rem',
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                                    background: 'transparent',
                                                }
                                            }}
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <code
                                {...rest}
                                className="bg-[var(--bg-editor)] p-1 border border-[var(--vscode-widget-border)] rounded font-mono text-[var(--fg-editor)] text-sm"
                            >
                                {children}
                            </code>
                        );
                    },
                    p({ children }) {
                        return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
                    },
                    ul({ children }) {
                        return <ul className="space-y-1 mb-4 ml-4 list-disc">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="space-y-1 mb-4 ml-4 list-decimal">{children}</ol>;
                    },
                    li({ children }) {
                        return <li className="leading-7">{children}</li>;
                    },
                    h1({ children }) {
                        return <h1 className="mt-6 mb-4 font-bold text-2xl">{children}</h1>;
                    },
                    h2({ children }) {
                        return <h2 className="mt-5 mb-3 font-bold text-xl">{children}</h2>;
                    },
                    h3({ children }) {
                        return <h3 className="mt-4 mb-2 font-semibold text-lg">{children}</h3>;
                    },
                    blockquote({ children }) {
                        return (
                            <blockquote className="my-4 pl-4 border-gray-300 border-l-4 text-gray-700 italic">
                                {children}
                            </blockquote>
                        );
                    },
                    table({ children }) {
                        return (
                            <div className="my-4 overflow-x-auto">
                                <table className="border border-gray-300 min-w-full border-collapse">
                                    {children}
                                </table>
                            </div>
                        );
                    },
                    thead({ children }) {
                        return <thead className="bg-gray-100">{children}</thead>;
                    },
                    tbody({ children }) {
                        return <tbody>{children}</tbody>;
                    },
                    tr({ children }) {
                        return <tr className="border-gray-300 border-b">{children}</tr>;
                    },
                    th({ children }) {
                        return (
                            <th className="px-4 py-2 border border-gray-300 font-semibold text-left">
                                {children}
                            </th>
                        );
                    },
                    td({ children }) {
                        return (
                            <td className="px-4 py-2 border border-gray-300">
                                {children}
                            </td>
                        );
                    },
                    a({ href, children }) {
                        return (
                            <a
                                href={href}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {msg.text}
            </Markdown>
        </div>
    );
}