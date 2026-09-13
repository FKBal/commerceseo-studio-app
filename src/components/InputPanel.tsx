import { useState, useRef, useEffect, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Search, AlertCircle, X, Lightbulb, CheckCircle2, FileImage, Sparkles } from 'lucide-react';
import { getPlatform } from '@/platforms';
import type { PlatformId } from '@/types';

const MAX_DESC = 500;
const MAX_FILES = 5;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const SEO_TIPS: Record<PlatformId, string[]> = {
  etsy: [
    'Use all 13 tags — each one is a separate ranking opportunity on Etsy.',
    'Long-tail tags (2-3 words) outperform single words.',
    'Front-load your most important keywords in the first 60 characters of your title.',
  ],
  amazon: [
    'Keep titles under 200 characters; first 75 chars are most critical for CTR.',
    'Use all 5 bullet points — each is a separate indexing opportunity.',
    'Backend search terms should not repeat words from the title.',
  ],
  shopify: [
    'Meta titles should be 50-60 characters for optimal Google display.',
    'Meta descriptions should be 150-160 characters with a clear CTA.',
    'URL handles should be short, lowercase, and keyword-rich.',
  ],
  ebay: [
    'Use all 80 title characters — include brand, model, and key specs.',
    'Fill as many item specifics as possible for filter visibility.',
    'Condition and material are critical search filters on eBay.',
  ],
};

interface FileEntry {
  id: number;
  file: File;
  previewUrl: string;
  progress: number;
  ready: boolean;
}

let fileIdCounter = 0;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeBadge(file: File): string {
  const type = file.type.split('/')[1]?.toUpperCase() ?? 'FILE';
  return type === 'JPEG' ? 'JPG' : type;
}

interface InputPanelProps {
  platform: PlatformId;
  description: string;
  onDescriptionChange: (v: string) => void;
  onOptimize: () => void;
  onTryExample: () => void;
  isGenerating: boolean;
  credits: number;
}

export function InputPanel({ platform, description, onDescriptionChange, onOptimize, onTryExample, isGenerating, credits }: InputPanelProps) {
  const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const config = getPlatform(platform);

  const simulateUpload = (entry: FileEntry) => {
    const interval = setInterval(() => {
      setFileEntries((prev) => {
        const updated = prev.map((f) => {
          if (f.id !== entry.id) return f;
          const nextProgress = f.progress + Math.random() * 22 + 8;
          if (nextProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, ready: true };
          }
          return { ...f, progress: nextProgress };
        });
        return updated;
      });
    }, 120);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => ACCEPTED_TYPES.includes(f.type));
    const remaining = MAX_FILES - fileEntries.length;
    const toAdd = valid.slice(0, remaining);
    const newEntries: FileEntry[] = toAdd.map((file) => ({
      id: ++fileIdCounter,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      ready: false,
    }));
    if (newEntries.length === 0) return;
    setFileEntries((prev) => [...prev, ...newEntries]);
    newEntries.forEach((entry) => simulateUpload(entry));
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id: number) => {
    setFileEntries((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      fileEntries.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
    };
  }, []);

  const canGenerate = credits > 0 && !isGenerating;

  return (
    <div className="flex flex-col gap-5">
      {/* Upload Zone */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Upload className="h-4 w-4 text-slate-400" />
          Product Photos
          {fileEntries.length > 0 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {fileEntries.length}/{MAX_FILES}
            </span>
          )}
        </label>
        <div
          onDragEnter={handleDragEnter}
          onDragOver={(e) => { e.preventDefault(); }}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200 ${
            isDragging
              ? 'animate-marching-ants border-[#5B3DF5] bg-[#5B3DF5]/10 shadow-[0_0_25px_rgba(91,61,245,0.25)]'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <div className="flex flex-col items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
              isDragging
                ? 'scale-110 bg-[#5B3DF5] text-white'
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-slate-700 dark:group-hover:text-slate-400'
            }`}>
              <Upload className="h-4.5 w-4.5" />
            </div>
            <p className={`text-sm font-medium transition-colors duration-200 ${
              isDragging ? 'text-[#5B3DF5]' : 'text-slate-700 dark:text-white'
            }`}>
              {isDragging ? (
                <>Release to drop your files here!</>
              ) : (
                <>Drag &amp; drop product photos or <span className="font-semibold text-[#5B3DF5]">browse</span></>
              )}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600">PNG, JPG, WEBP — up to {MAX_FILES} photos</p>
          </div>
        </div>

        {/* File Cards */}
        {fileEntries.length > 0 && (
          <div className="mt-3 space-y-2">
            {fileEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <img src={entry.previewUrl} alt={entry.file.name} className="h-full w-full object-cover" />
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{entry.file.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {getFileTypeBadge(entry.file)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatFileSize(entry.file.size)}</span>
                    {entry.ready && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#0d9488]">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready
                      </span>
                    )}
                  </div>
                  {/* Progress Bar */}
                  {!entry.ready && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-[#5B3DF5] transition-all duration-150 ease-out"
                          style={{ width: `${entry.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{Math.round(entry.progress)}%</span>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(entry.id); }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description Input */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Product Description</label>
          <button
            onClick={onTryExample}
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#5B3DF5]/30 bg-[#E8DEFF] px-3 py-1 text-xs font-semibold text-[#5B3DF5] transition-all hover:border-[#5B3DF5]/50 hover:bg-[#E8DEFF]/70 active:scale-95"
          >
            <Sparkles className="h-3 w-3 transition-transform group-hover:rotate-12" />
            Try Example Product
          </button>
        </div>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value.slice(0, MAX_DESC))}
            placeholder="Describe your product in detail... (e.g., Handmade minimalist leather wallet)"
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#5B3DF5] focus:outline-none focus:ring-1 focus:ring-[#5B3DF5] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder-slate-600"
          />
          <div className="pointer-events-none absolute bottom-3 right-4 text-xs font-medium text-slate-400 dark:text-slate-600">
            {description.length}/{MAX_DESC}
          </div>
        </div>
      </div>

      {/* Optimize Button */}
      <button
        onClick={onOptimize}
        disabled={!canGenerate}
        className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all ${
          canGenerate ? 'bg-[#5B3DF5] text-white hover:bg-[#4a2de0] active:scale-[0.98]' : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
        }`}
      >
        {isGenerating ? (
          <>
            <Search className="h-4.5 w-4.5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Search className="h-4.5 w-4.5" />
            <span>Optimize Listing</span>
          </>
        )}
      </button>

      {credits === 0 && (
        <div className="-mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>No credits remaining. Upgrade to continue.</span>
        </div>
      )}

      {/* SEO Tips */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">{config.name} SEO Tips</h3>
        </div>
        <ul className="space-y-2">
          {SEO_TIPS[platform].map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
              <span className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600">&bull;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
