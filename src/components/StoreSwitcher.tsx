import { useState, useRef, useEffect } from 'react';
import { Store, ChevronDown, Plus, Check } from 'lucide-react';
import type { StoreProfile } from '@/types';
import { getPlatform } from '@/platforms';

interface StoreSwitcherProps {
  stores: StoreProfile[];
  activeStoreId: string | null;
  onSelectStore: (id: string) => void;
  onAddStore: () => void;
}

export function StoreSwitcher({ stores, activeStoreId, onSelectStore, onAddStore }: StoreSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeStore = stores.find((s) => s.id === activeStoreId) ?? null;

  // Group stores by platform
  const byPlatform = stores.reduce<Record<string, StoreProfile[]>>((acc, s) => {
    (acc[s.platform] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-[#343740] dark:bg-[#25272C] dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        <Store className="h-4 w-4 text-[#5B3DF5]" />
        <span className="hidden sm:inline">
          {activeStore ? (
            <>{getPlatform(activeStore.platform).shortName}: {activeStore.name}</>
          ) : (
            'Select Store'
          )}
        </span>
        <span className="sm:hidden">{activeStore ? activeStore.name : 'Store'}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 animate-fade-in rounded-lg border border-slate-200 bg-white shadow-xl dark:border-[#343740] dark:bg-[#25272C]">
          {/* Header */}
          <div className="border-b border-slate-200 px-4 py-2.5 dark:border-[#343740]">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Your Stores</p>
          </div>

          {/* Store list grouped by platform */}
          <div className="max-h-64 overflow-y-auto p-1">
            {stores.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">No stores yet. Add one to get started.</p>
            )}
            {Object.entries(byPlatform).map(([platId, storeList]) => {
              const plat = getPlatform(platId as StoreProfile['platform']);
              return (
                <div key={platId} className="mb-1">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-600">{plat.name}</p>
                  {storeList.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => { onSelectStore(store.id); setOpen(false); }}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold ${store.id === activeStoreId ? 'bg-[#5B3DF5] text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {plat.shortName.slice(0, 2)}
                      </span>
                      <span className="flex-1 text-left">{store.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{store.tone}</span>
                      {store.id === activeStoreId && <Check className="h-3.5 w-3.5 text-[#5B3DF5]" />}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Add new store */}
          <div className="border-t border-slate-200 p-1 dark:border-[#343740]">
            <button
              onClick={() => { setOpen(false); onAddStore(); }}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold text-[#5B3DF5] transition-colors hover:bg-[#E8DEFF] dark:hover:bg-[#5B3DF5]/10"
            >
              <Plus className="h-4 w-4" />
              Add New Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
