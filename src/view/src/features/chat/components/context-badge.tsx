import { FileCode, Hash } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

const LANG_LABELS: Record<string, string> = {
  typescript: 'TS',
  javascript: 'JS',
  typescriptreact: 'TSX',
  javascriptreact: 'JSX',
  python: 'PY',
  rust: 'RS',
  go: 'GO',
  java: 'JAVA',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  markdown: 'MD',
  shellscript: 'SH',
  yaml: 'YAML',
};

export function ContextBadge() {
  const activeFile = useUIStore((s) => s.activeFile);

  if (!activeFile) return null;

  const langLabel = LANG_LABELS[activeFile.languageId] ?? activeFile.languageId.toUpperCase();

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1 mb-2.5 rounded-lg bg-bg-subtle/50 border border-border text-secondary-fg text-[10px] w-fit max-w-full animate-fade-in group hover:border-brand/30 transition-all shadow-sm"
      title={`Active context: ${activeFile.fileName}`}
    >
      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest">
        <FileCode size={12} className="text-brand shrink-0" />
        <span className="truncate max-w-[140px] text-fg-editor">{activeFile.fileName}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded-md bg-bg-editor border border-border text-[9px] font-black tracking-tighter opacity-80 group-hover:opacity-100">
        <Hash size={10} className="text-secondary-fg/50" />
        {langLabel}
      </div>
    </div>
  );
}
