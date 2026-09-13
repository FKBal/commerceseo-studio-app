import { useState } from 'react';
import { BarChart3, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthOverlayProps {
  onAuth: (email: string) => void;
}

export function AuthOverlay({ onAuth }: AuthOverlayProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = email.trim() || 'demo@commerceseo.com';
    onAuth(user);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5B3DF5]">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">CommerceSEO Studio</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">Multi-platform listing optimization</p>
        </div>

        {/* Auth Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#25272C]">
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                mode === 'signin' ? 'bg-[#5B3DF5] text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                mode === 'signup' ? 'bg-[#5B3DF5] text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5B3DF5] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#4a2de0] active:scale-95"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600">
            Demo mode — any email and password will work.
          </p>
        </div>
      </div>
    </div>
  );
}
