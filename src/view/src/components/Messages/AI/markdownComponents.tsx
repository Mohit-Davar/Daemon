import type { Components } from 'react-markdown';

import { CodeBlock } from '@/components/Messages/AI/codeBlock';

export const markdownComponents: Components = {
    code: CodeBlock,

    p({ children }) {
        return (
            <p className="mb-4 last:mb-0 leading-7">
                {children}
            </p>
        );
    },

    ul({ children }) {
        return (
            <ul className="space-y-1 mb-4 ml-4 list-disc">
                {children}
            </ul>
        );
    },

    ol({ children }) {
        return (
            <ol className="space-y-1 mb-4 ml-4 list-decimal">
                {children}
            </ol>
        );
    },

    li({ children }) {
        return (
            <li className="leading-7">
                {children}
            </li>
        );
    },

    h1({ children }) {
        return (
            <h1 className="mt-6 mb-4 font-bold text-2xl">
                {children}
            </h1>
        );
    },

    h2({ children }) {
        return (
            <h2 className="mt-5 mb-3 font-bold text-xl">
                {children}
            </h2>
        );
    },

    h3({ children }) {
        return (
            <h3 className="mt-4 mb-2 font-semibold text-lg">
                {children}
            </h3>
        );
    },

    blockquote({ children }) {
        return (
            <blockquote className="my-4 pl-4 border-l-4 italic">
                {children}
            </blockquote>
        );
    },

    table({ children }) {
        return (
            <div className="my-4 overflow-x-auto">
                <table className="border min-w-full border-collapse">
                    {children}
                </table>
            </div>
        );
    },

    th({ children }) {
        return (
            <th className="px-4 py-2 border font-semibold text-left">
                {children}
            </th>
        );
    },

    td({ children }) {
        return (
            <td className="px-4 py-2 border">
                {children}
            </td>
        );
    },

    a({ href, children, ...props }) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                {...props}
            >
                {children}
            </a>
        );
    },
};
