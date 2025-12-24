import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('go', go);

export { atomOneDark, SyntaxHighlighter };
