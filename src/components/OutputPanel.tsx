import { useState, useEffect, useRef } from 'react';
import { Copy, Check, Download, Type, Tag, FileText, Search, Link, ListChecks } from 'lucide-react';
import { getPlatform } from '@/platforms';
import type { GeneratedResult, PlatformId } from '@/types';

interface OutputPanelProps {
  result: GeneratedResult | null;
  platform: PlatformId;
  isGenerating: boolean;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
  onDownload: (format: 'txt' | 'csv' | 'json') => void;
}

function CharBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const isOver = current > max;
  const isGood = pct >= 80 && !isOver;
  const color = isOver ? 'bg-rose-500' : isGood ? 'bg-[#B8F7E4]' : 'bg-amber-500';
  const textColor = isOver ? 'text-rose-500' : isGood ? 'text-[#0d9488]' : 'text-amber-500';

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{current}/{max}</span>
    </div>
  );
}

function CopyButton({ field, label, onCopy, copiedField }: { field: string; label: string; onCopy: () => void; copiedField: string | null }) {
  const isCopied = copiedField === field;
  return (
    <button
      onClick={onCopy}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
        isCopied
          ? 'border-[#0d9488] bg-[#B8F7E4]/20 text-[#0d9488]'
          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {isCopied ? 'Copied!' : label}
    </button>
  );
}

function Card({ icon, title, badge, action, children }: {
  icon: React.ReactNode; title: string; badge?: string; action: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">{icon}</div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
          {badge && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{badge}</span>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function getLoadingMessage(progress: number): string {
  if (progress <= 30) return 'Analyzing product image & metadata...';
  if (progress <= 70) return 'Checking platform SEO algorithms & tags...';
  if (progress < 100) return 'Formatting optimized listing...';
  return 'Done!';
}

const PROGRESS_STEPS = [0, 15, 38, 65, 88, 100];
const STEP_DELAY = 400;

function LoadingState() {
  const [progress, setProgress] = useState(0);
  const stepIndexRef = useRef(0);

  useEffect(() => {
    stepIndexRef.current = 0;
    setProgress(0);

    const interval = setInterval(() => {
      stepIndexRef.current += 1;
      if (stepIndexRef.current >= PROGRESS_STEPS.length) {
        clearInterval(interval);
        return;
      }
      setProgress(PROGRESS_STEPS[stepIndexRef.current]);
    }, STEP_DELAY);

    return () => clearInterval(interval);
  }, []);

  const message = getLoadingMessage(progress);
  const ringColor = progress >= 100 ? '#B8F7E4' : '#5B3DF5';
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col gap-3">
      {/* Status Box */}
      <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        {/* Circular Progress */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200 dark:text-slate-800" />
            <circle
              cx="32" cy="32" r="28" fill="none" stroke={ringColor} strokeWidth="4"
              strokeLinecap="round" strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-100 ease-linear"
            />
          </svg>
          <span className="absolute text-sm font-bold text-slate-700 dark:text-slate-200">{Math.round(progress)}%</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5B3DF5] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5B3DF5]" />
            </span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-[#5B3DF5] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skeleton Cards */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="ml-auto h-7 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-2.5">
            <div className="h-3 w-full rounded bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-3 w-5/6 rounded bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-3 w-2/3 rounded bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OutputPanel({ result, platform, isGenerating, onCopy, copiedField, onDownload }: OutputPanelProps) {
  const config = getPlatform(platform);

  if (isGenerating) {
    return <LoadingState />;
  }

  if (!result) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-7 w-7 text-slate-300 dark:text-slate-700" />
        </div>
        <h3 className="mb-1.5 text-base font-semibold text-slate-500 dark:text-slate-400">No results yet</h3>
        <p className="max-w-xs text-sm leading-relaxed text-slate-400 dark:text-slate-600">
          Optimized {config.name} listing data will appear here after analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Export Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Export:</span>
        {(['txt', 'csv', 'json'] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => onDownload(fmt)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold uppercase text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Download className="h-3.5 w-3.5" />
            {fmt}
          </button>
        ))}
      </div>

      {/* Title */}
      <Card icon={<Type className="h-4 w-4 text-slate-400" />} title="SEO Title"
        action={<CopyButton field="title" label="Copy" onCopy={() => onCopy(result.title, 'title')} copiedField={copiedField} />}>
        <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{result.title}</p>
        <CharBar current={result.title.length} max={config.limits.title} />
      </Card>

      {/* Tags (Etsy) */}
      {result.tags && (
        <Card icon={<Tag className="h-4 w-4 text-slate-400" />} title="SEO Tags" badge={`${result.tags.length}`}
          action={<CopyButton field="tags" label="Copy All Tags" onCopy={() => onCopy(result.tags!.join(', '), 'tags')} copiedField={copiedField} />}>
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center rounded-md border border-slate-200 bg-[#E8DEFF] px-2.5 py-1 text-xs font-medium text-[#5B3DF5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Description (Etsy) */}
      {result.description && (
        <Card icon={<FileText className="h-4 w-4 text-slate-400" />} title="Description"
          action={<CopyButton field="description" label="Copy" onCopy={() => onCopy(result.description!, 'description')} copiedField={copiedField} />}>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.description}</p>
        </Card>
      )}

      {/* Bullet Points (Amazon) */}
      {result.bullets && (
        <Card icon={<ListChecks className="h-4 w-4 text-slate-400" />} title="Bullet Points" badge={`${result.bullets.length}`}
          action={<CopyButton field="bullets" label="Copy All" onCopy={() => onCopy(result.bullets!.join('\n'), 'bullets')} copiedField={copiedField} />}>
          <div className="space-y-2">
            {result.bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-md border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{bullet}</p>
                  <CharBar current={bullet.length} max={125} />
                </div>
                <CopyButton field={`bullet-${i}`} label="" onCopy={() => onCopy(bullet, `bullet-${i}`)} copiedField={copiedField} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Backend Search Terms (Amazon) */}
      {result.searchTerms && (
        <Card icon={<Search className="h-4 w-4 text-slate-400" />} title="Backend Search Terms"
          action={<CopyButton field="searchTerms" label="Copy" onCopy={() => onCopy(result.searchTerms!, 'searchTerms')} copiedField={copiedField} />}>
          <p className="rounded-md border border-slate-200 bg-slate-100 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">{result.searchTerms}</p>
        </Card>
      )}

      {/* Meta Title (Shopify) */}
      {result.metaTitle && (
        <Card icon={<Type className="h-4 w-4 text-slate-400" />} title="Google Meta Title"
          action={<CopyButton field="metaTitle" label="Copy" onCopy={() => onCopy(result.metaTitle!, 'metaTitle')} copiedField={copiedField} />}>
          <p className="text-sm text-slate-800 dark:text-slate-200">{result.metaTitle}</p>
          <CharBar current={result.metaTitle.length} max={60} />
        </Card>
      )}

      {/* Meta Description (Shopify) */}
      {result.metaDescription && (
        <Card icon={<FileText className="h-4 w-4 text-slate-400" />} title="Google Meta Description"
          action={<CopyButton field="metaDescription" label="Copy" onCopy={() => onCopy(result.metaDescription!, 'metaDescription')} copiedField={copiedField} />}>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.metaDescription}</p>
          <CharBar current={result.metaDescription.length} max={160} />
        </Card>
      )}

      {/* URL Handle (Shopify) */}
      {result.urlHandle && (
        <Card icon={<Link className="h-4 w-4 text-slate-400" />} title="URL Handle"
          action={<CopyButton field="urlHandle" label="Copy" onCopy={() => onCopy(result.urlHandle!, 'urlHandle')} copiedField={copiedField} />}>
          <p className="rounded-md border border-slate-200 bg-slate-100 p-3 font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">/{result.urlHandle}</p>
        </Card>
      )}

      {/* Item Specifics (eBay) */}
      {result.itemSpecifics && (
        <Card icon={<ListChecks className="h-4 w-4 text-slate-400" />} title="Item Specifics" badge={`${result.itemSpecifics.length}`}
          action={<CopyButton field="specifics" label="Copy All" onCopy={() => onCopy(result.itemSpecifics!.map((s) => `${s.label}: ${s.value}`).join('\n'), 'specifics')} copiedField={copiedField} />}>
          <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <tbody>
                {result.itemSpecifics.map((spec, i) => (
                  <tr key={i} className={i > 0 ? 'border-t border-slate-200 dark:border-slate-800' : ''}>
                    <td className="w-1/3 bg-slate-100 px-3 py-2.5 font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-500">{spec.label}</td>
                    <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
