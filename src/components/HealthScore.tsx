import { CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import type { ScoreBreakdown } from '@/platforms';

interface HealthScoreProps {
  total: number;
  items: ScoreBreakdown[];
}

export function HealthScore({ total, items }: HealthScoreProps) {
  const isHigh = total >= 80;
  const scoreColor = isHigh ? 'text-[#0d9488]' : total >= 50 ? 'text-amber-500' : 'text-rose-500';
  const ringColor = isHigh ? '#B8F7E4' : total >= 50 ? '#fbbf24' : '#fb7185';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (total / 100) * circumference;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#25272C]">
      <div className="flex items-center gap-5">
        {/* Gauge */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke={ringColor} strokeWidth="6"
              strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>{total}</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Score</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">SEO Health Breakdown</h3>
          </div>
          {items.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {item.positive ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#0d9488]" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  )}
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                </div>
                <span className={`font-semibold ${item.positive ? 'text-[#0d9488]' : 'text-amber-500'}`}>
                  {item.positive ? '+' : ''}{item.score}
                </span>
              </div>
              {/* Metric bar */}
              <div className="mt-1 ml-5.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.positive ? 'bg-[#B8F7E4]' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(Math.abs(item.score) * 5, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Tip pills */}
          {isHigh && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-[#B8F7E4]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#0d9488]">Excellent</span>
              <span className="rounded-full bg-[#E8DEFF] px-2.5 py-0.5 text-[10px] font-semibold text-[#5B3DF5]">High CTR Potential</span>
            </div>
          )}
          {total >= 50 && total < 80 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">Needs Improvement</span>
            </div>
          )}
          {total < 50 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">Critical Issues</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
