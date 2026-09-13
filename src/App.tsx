import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { PlatformTabs } from '@/components/PlatformTabs';
import { InputPanel } from '@/components/InputPanel';
import { OutputPanel } from '@/components/OutputPanel';
import { HealthScore } from '@/components/HealthScore';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { PricingModal } from '@/components/PricingModal';
import { Toast } from '@/components/Toast';
import { SettingsDrawer, type UserSettings } from '@/components/SettingsDrawer';
import { AuthOverlay } from '@/components/AuthOverlay';
import { AddStoreModal } from '@/components/AddStoreModal';
import { generateListing, calculateHealthScore, getPlatform } from '@/platforms';
import { downloadListing } from '@/export';
import type { PlatformId, GeneratedResult, HistoryEntry, ToastState, StoreProfile } from '@/types';

const FREE_CREDITS = 3;
const GENERATE_DELAY = 2400;
const MAX_HISTORY = 10;
const PRO_CREDITS = 100;

const EXAMPLE_DESCRIPTION =
  'Handmade genuine leather minimalist wallet with 6 card slots and coin pocket, RFID blocking, hand-stitched edges, and a slim profile that fits any pocket perfectly.';

const STORAGE_KEYS = {
  auth: 'cseo_auth',
  email: 'cseo_email',
  settings: 'cseo_settings',
  stores: 'cseo_stores',
  activeStore: 'cseo_active_store',
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  brandName: '',
  defaultMarketplace: 'etsy',
  emailReports: true,
  usageAlerts: true,
};

function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function loadAuthState(): { isLoggedIn: boolean; email: string } {
  try {
    const loggedIn = localStorage.getItem(STORAGE_KEYS.auth) === 'true';
    const email = localStorage.getItem(STORAGE_KEYS.email) ?? '';
    return { isLoggedIn: loggedIn, email };
  } catch {
    return { isLoggedIn: false, email: '' };
  }
}

function loadStores(): StoreProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.stores);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function loadActiveStoreId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.activeStore);
  } catch { return null; }
}

function App() {
  const [authState, setAuthState] = useState(loadAuthState);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [platform, setPlatform] = useState<PlatformId>(settings.defaultMarketplace);
  const [credits, setCredits] = useState(FREE_CREDITS);
  const [maxCredits, setMaxCredits] = useState(FREE_CREDITS);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const historyIdRef = useRef(0);

  // Store management state
  const [stores, setStores] = useState<StoreProfile[]>(loadStores);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(loadActiveStoreId);
  const [addStoreOpen, setAddStoreOpen] = useState(false);

  // Persist auth state
  useEffect(() => {
    if (authState.isLoggedIn) {
      localStorage.setItem(STORAGE_KEYS.auth, 'true');
      localStorage.setItem(STORAGE_KEYS.email, authState.email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.auth);
      localStorage.removeItem(STORAGE_KEYS.email);
    }
  }, [authState]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);

  // Apply theme: toggle 'dark' class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [settings.theme]);

  // Persist stores
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(stores));
  }, [stores]);

  // Persist active store
  useEffect(() => {
    if (activeStoreId) {
      localStorage.setItem(STORAGE_KEYS.activeStore, activeStoreId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeStore);
    }
  }, [activeStoreId]);

  // When active store changes, switch platform to match
  const activeStore = stores.find((s) => s.id === activeStoreId) ?? null;
  useEffect(() => {
    if (activeStore) {
      setPlatform(activeStore.platform);
      setResult(null);
    }
  }, [activeStoreId]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast((t) => (t ? { ...t, visible: false } : null)), 2500);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedField((f) => (f === field ? null : f)), 2000);
  };

  const handleAuth = (email: string) => {
    setAuthState({ isLoggedIn: true, email });
    showToast('Welcome to CommerceSEO Studio');
  };

  const handleLogout = () => {
    setAuthState({ isLoggedIn: false, email: '' });
    setSettingsOpen(false);
    setCredits(FREE_CREDITS);
    setMaxCredits(FREE_CREDITS);
    setResult(null);
    setHistory([]);
    setUnreadCount(0);
    setStores([]);
    setActiveStoreId(null);
    showToast('Signed out successfully');
  };

  const handleThemeToggle = () => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const handlePlatformChange = (newPlatform: PlatformId) => {
    setPlatform(newPlatform);
    setResult(null);
  };

  const handleAddStore = (store: StoreProfile) => {
    setStores((prev) => [...prev, store]);
    setActiveStoreId(store.id);
    setAddStoreOpen(false);
    showToast(`Store "${store.name}" added and activated`);
  };

  const handleOptimize = () => {
    if (credits <= 0) { setModalOpen(true); return; }
    setIsGenerating(true);
    setResult(null);
    setTimeout(() => {
      const generated = generateListing(platform, description);
      setResult(generated);
      const newCredits = credits - 1;
      setCredits(newCredits);
      setIsGenerating(false);
      showToast('Listing optimized successfully');

      const entry: HistoryEntry = {
        id: ++historyIdRef.current,
        platform,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        result: generated,
        storeId: activeStore?.id,
        storeName: activeStore?.name,
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
      setUnreadCount((prev) => Math.min(prev + 1, 9));

      if (newCredits === 0) setModalOpen(true);
    }, GENERATE_DELAY);
  };

  const handleUpgrade = (_planName: string) => {
    setModalOpen(false);
    setCredits(PRO_CREDITS);
    setMaxCredits(PRO_CREDITS);
    showToast('Demo Checkout Successful! (Stripe Integration Point)');
  };

  const handleResetCredits = () => {
    setCredits(FREE_CREDITS);
    setMaxCredits(FREE_CREDITS);
    setModalOpen(false);
    showToast('Demo credits reset to 3/3');
  };

  const handleDownload = (format: 'txt' | 'csv' | 'json') => {
    if (!result) return;
    downloadListing(result, platform, format);
    showToast(`Listing exported as .${format}`);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setPlatform(entry.platform);
    setResult(entry.result);
    setHistoryOpen(false);
    showToast('Listing loaded from history');
  };

  const handleHistoryDelete = (id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('Listing removed from history');
  };

  const handleHistoryRead = () => {
    setUnreadCount(0);
  };

  const handleSettingsSave = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const scoreData = result ? calculateHealthScore(platform, result) : null;
  const config = getPlatform(platform);

  if (!authState.isLoggedIn) {
    return <AuthOverlay onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar
        credits={credits}
        maxCredits={maxCredits}
        onUpgradeClick={() => setModalOpen(true)}
        onHistoryClick={() => setHistoryOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        userEmail={authState.email}
        onLogout={handleLogout}
        unreadCount={unreadCount}
        onHistoryRead={handleHistoryRead}
        theme={settings.theme}
        onThemeToggle={handleThemeToggle}
        stores={stores}
        activeStoreId={activeStoreId}
        onSelectStore={setActiveStoreId}
        onAddStore={() => setAddStoreOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Platform Tabs */}
        <div className="mb-6">
          <PlatformTabs active={platform} onChange={handlePlatformChange} />
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {config.description} — {config.name} optimization mode
            {activeStore && <span className="text-[#5B3DF5]"> · {activeStore.name}</span>}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left Column - Input */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#343740] dark:bg-[#25272C] sm:p-6">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Listing Input</h2>
            <InputPanel
              platform={platform}
              description={description}
              onDescriptionChange={setDescription}
              onOptimize={handleOptimize}
              onTryExample={() => setDescription(EXAMPLE_DESCRIPTION)}
              isGenerating={isGenerating}
              credits={credits}
            />
          </div>

          {/* Right Column - Output */}
          <div className="flex flex-col gap-4">
            {/* Health Score */}
            {scoreData && (
              <HealthScore total={scoreData.total} items={scoreData.items} />
            )}

            {/* Output */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#343740] dark:bg-[#25272C] sm:p-6">
              <h2 className="mb-5 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Generated Output</h2>
              <OutputPanel
                result={result}
                platform={platform}
                isGenerating={isGenerating}
                onCopy={handleCopy}
                copiedField={copiedField}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>
      </main>

      <PricingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpgrade={handleUpgrade}
        onResetCredits={handleResetCredits}
      />

      <HistoryDrawer
        history={history}
        onSelect={handleHistorySelect}
        onDelete={handleHistoryDelete}
        onCopy={handleCopy}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSettingsSave}
        onLogout={handleLogout}
      />

      <AddStoreModal
        open={addStoreOpen}
        onClose={() => setAddStoreOpen(false)}
        onAdd={handleAddStore}
        defaultPlatform={platform}
      />

      <Toast toast={toast} />
    </div>
  );
}

export default App;
