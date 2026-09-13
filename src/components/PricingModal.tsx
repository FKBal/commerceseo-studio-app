import { useState } from 'react';
import { X, CheckCircle2, RefreshCw } from 'lucide-react';
import type { PricingPlan } from '@/types';

const CHECKOUT_DELAY = 1000;

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 12,
    features: ['100 Listings per month', 'All 4 platforms', '13 SEO tags per listing', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: ['Unlimited listings', 'Priority speed', 'All 4 platforms', 'SEO health scoring', 'Priority support'],
    highlight: true,
    badge: 'Most Popular',
  },
];

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (planName: string) => void;
  onResetCredits: () => void;
}

export function PricingModal({ open, onClose, onUpgrade, onResetCredits }: PricingModalProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);

  if (!open) return null;

  const handleCheckout = (planName: string) => {
    setIsCheckingOut(true);
    setCheckoutPlan(planName);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutPlan(null);
      onUpgrade(planName);
    }, CHECKOUT_DELAY);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={isCheckingOut ? undefined : onClose}>
      <div className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/70" />
      <div className="relative w-full max-w-2xl animate-modal-in" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#25272C]">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upgrade Your Plan</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Unlock unlimited credits and all platform features.</p>
              </div>
              <button onClick={onClose} disabled={isCheckingOut}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 disabled:opacity-50">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.id}
                className={`relative flex flex-col rounded-lg border p-5 transition-all ${
                  plan.highlight
                    ? 'border-[#5B3DF5] bg-[#E8DEFF]/30 ring-1 ring-[#5B3DF5]/20 dark:bg-[#5B3DF5]/5'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                }`}>
                {plan.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-md bg-[#5B3DF5] px-2.5 py-0.5 text-xs font-bold text-white">{plan.badge}</span>
                  </div>
                )}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-sm text-slate-400 dark:text-slate-500">/month</span>
                </div>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5B3DF5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(plan.name)} disabled={isCheckingOut}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-70 ${
                    plan.highlight ? 'bg-[#5B3DF5] text-white hover:bg-[#4a2de0]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                  }`}>
                  {isCheckingOut && checkoutPlan === plan.name ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" />Processing...</>
                  ) : 'Upgrade Now'}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 text-center dark:border-slate-800 sm:px-8">
            <button onClick={onResetCredits} disabled={isCheckingOut}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-50 dark:hover:text-slate-300">
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo Credits (3/3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
