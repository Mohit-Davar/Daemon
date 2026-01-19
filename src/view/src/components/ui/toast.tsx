import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';

export function Toast() {
  const { error, setError } = useUIStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-200 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[90vw]">
        <AlertCircle size={18} className="text-red-500 shrink-0" />
        <p className="text-sm font-medium flex-1">{error}</p>
        <button
          onClick={() => setError(null)}
          className="p-1 hover:bg-white/5 rounded-md transition-colors"
        >
          <X size={14} className="text-red-500/60 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}
