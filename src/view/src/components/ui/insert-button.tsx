import { useState } from 'react';
import { Check, SquareTerminal } from 'lucide-react';
import { VSCode } from '@/lib/vscode';

export function InsertButton({ code }: { code: string }) {
  const [inserted, setInserted] = useState(false);

  const handleInsert = () => {
    VSCode.postMessage({ command: 'insertCode', data: { code } });
    setInserted(true);
    setTimeout(() => setInserted(false), 2000);
  };

  return (
    <button
      onClick={handleInsert}
      className="p-2 rounded-md text-[var(--secondary-fg)] hover:text-[var(--fg-editor)] transition-colors cursor-pointer"
      aria-label={inserted ? 'Inserted' : 'Insert at cursor'}
      title={inserted ? 'Inserted!' : 'Insert at cursor'}
    >
      {inserted ? <Check size={14} className="text-green-500" /> : <SquareTerminal size={14} />}
    </button>
  );
}
