import { useState, useEffect } from 'react';
import { X, Settings, User, Bell, LogOut, Check } from 'lucide-react';
import { PLATFORMS } from '@/platforms';
import type { PlatformId } from '@/types';

export interface UserSettings {
  theme: 'dark' | 'light';
  brandName: string;
  defaultMarketplace: PlatformId;
  emailReports: boolean;
  usageAlerts: boolean;
}

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onLogout: () => void;
}

export function SettingsDrawer({ isOpen, onClose, settings, onSave, onLogout }: SettingsDrawerProps) {
  const [local, setLocal] = useState<UserSettings>(settings);

  useEffect(() => { setLocal(settings); }, [settings]);

  if (!isOpen) return null;

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onSave(updated);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-950/40 animate-fade-in dark:bg-slate-950/60" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md animate-slide-in border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#25272C]">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="h-[calc(100vh-56px)] overflow-y-auto p-5">
          {/* Profile Preferences */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Profile Preferences</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <User className="h-4 w-4 text-slate-400" />
                  Default Brand Name
                </label>
                <input
                  type="text"
                  value={local.brandName}
                  onChange={(e) => update('brandName', e.target.value)}
                  placeholder="Your brand name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Default Marketplace</label>
                <select
                  value={local.defaultMarketplace}
                  onChange={(e) => update('defaultMarketplace', e.target.value as PlatformId)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Notifications</h3>
            <div className="space-y-2">
              <ToggleRow
                icon={<Bell className="h-4 w-4 text-slate-400" />}
                label="Email Reports"
                description="Weekly SEO performance summaries"
                value={local.emailReports}
                onChange={(v) => update('emailReports', v)}
              />
              <ToggleRow
                icon={<Bell className="h-4 w-4 text-slate-400" />}
                label="Usage Alerts"
                description="Notify when credits run low"
                value={local.usageAlerts}
                onChange={(v) => update('usageAlerts', v)}
              />
            </div>
          </section>

          {/* Account Actions */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Account</h3>
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-100 active:scale-95 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </section>
        </div>
      </div>
    </>
  );
}

function ToggleRow({ icon, label, description, value, onChange }: {
  icon: React.ReactNode; label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? 'bg-[#5B3DF5]' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}>
          {value && <Check className="h-3 w-3 text-[#5B3DF5]" />}
        </span>
      </button>
    </div>
  );
}
