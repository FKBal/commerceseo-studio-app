import { useState } from 'react';
import { X, Store, Plus } from 'lucide-react';
import { PLATFORMS } from '@/platforms';
import type { PlatformId, ToneOfVoice, StoreProfile } from '@/types';

const TONES: ToneOfVoice[] = ['Professional', 'Luxury', 'Casual', 'Playful', 'Minimalist'];

interface AddStoreModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (store: StoreProfile) => void;
  defaultPlatform?: PlatformId;
}

export function AddStoreModal({ open, onClose, onAdd, defaultPlatform = 'shopify' }: AddStoreModalProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<PlatformId>(defaultPlatform);
  const [tone, setTone] = useState<ToneOfVoice>('Professional');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      id: `store_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      platform,
      tone,
      createdAt: Date.now(),
    });
    setName('');
    setPlatform(defaultPlatform);
    setTone('Professional');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/70" />
      <div className="relative w-full max-w-md animate-modal-in" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-[#343740] dark:bg-[#25272C]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#343740]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3DF5]">
                <Store className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Add New Store</h2>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 p-5">
            {/* Store Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Store Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Store Alpha"
                autoFocus
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Platform</label>
              <div className="grid grid-cols-4 gap-1.5">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${
                      platform === p.id
                        ? 'border-[#5B3DF5] bg-[#5B3DF5] text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    {p.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Brand Tone of Voice</label>
              <div className="flex flex-wrap gap-1.5">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      tone === t
                        ? 'bg-[#5B3DF5] text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5B3DF5] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#4a2de0] active:scale-95 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Save Store
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
