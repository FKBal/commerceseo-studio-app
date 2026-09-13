import { PLATFORMS } from '@/platforms';
import type { PlatformId } from '@/types';

interface PlatformTabsProps {
  active: PlatformId;
  onChange: (id: PlatformId) => void;
}

export function PlatformTabs({ active, onChange }: PlatformTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-[#25272C]">
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all ${
            active === p.id
              ? 'bg-[#5B3DF5] text-white'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {p.shortName}
        </button>
      ))}
    </div>
  );
}
