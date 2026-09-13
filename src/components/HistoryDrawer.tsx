import { Clock, X, Copy, Trash2, Store } from 'lucide-react';
import { getPlatform } from '@/platforms';
import type { HistoryEntry } from '@/types';

interface HistoryDrawerProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: number) => void;
  onCopy: (text: string, field: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ history, onSelect, onDelete, onCopy, isOpen, onClose }: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/40 animate-fade-in dark:bg-slate-950/60" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md animate-slide-in border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#25272C]">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Saved History</h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{history.length}</span>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="h-[calc(100vh-56px)] overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Clock className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-500 dark:text-slate-500">No saved listings yet.</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">Your last 10 generations will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((entry) => {
                const config = getPlatform(entry.platform);
                return (
                  <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#E8DEFF] px-2 py-0.5 text-[10px] font-bold uppercase text-[#5B3DF5]">{config.shortName}</span>
                        {entry.storeName && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            <Store className="h-3 w-3" />
                            {entry.storeName}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-600">{entry.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => onCopy(entry.result.title, `history-${entry.id}`)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onDelete(entry.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => onSelect(entry)} className="block w-full text-left">
                      <p className="mb-2 line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-200">{entry.result.title}</p>
                      {entry.result.tags && entry.result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.result.tags.slice(0, 4).map((tag, i) => (
                            <span key={i} className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">{tag}</span>
                          ))}
                          {entry.result.tags.length > 4 && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-800 dark:text-slate-500">+{entry.result.tags.length - 4}</span>
                          )}
                        </div>
                      )}
                      {entry.result.bullets && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">{entry.result.bullets.length} bullet points generated</p>
                      )}
                      {entry.result.itemSpecifics && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">{entry.result.itemSpecifics.length} item specifics</p>
                      )}
                      {entry.result.metaTitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">Meta title: {entry.result.metaTitle}</p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
