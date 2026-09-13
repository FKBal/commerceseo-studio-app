import { CheckCircle2 } from 'lucide-react';
import type { ToastState } from '@/types';

export function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast || !toast.visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[70] animate-toast-in">
      <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-2xl dark:border-slate-700 dark:bg-[#25272C]">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0d9488]" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">{toast.message}</span>
      </div>
    </div>
  );
}
