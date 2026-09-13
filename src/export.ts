import type { GeneratedResult, PlatformId } from './types';
import { getPlatform } from './platforms';

export function downloadListing(result: GeneratedResult, platform: PlatformId, format: 'txt' | 'csv' | 'json') {
  const config = getPlatform(platform);
  let content: string;
  let mimeType: string;
  let extension: string;

  if (format === 'json') {
    content = JSON.stringify({ platform: config.name, ...result }, null, 2);
    mimeType = 'application/json';
    extension = 'json';
  } else if (format === 'csv') {
    const rows: string[] = ['Field,Value'];
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    rows.push(`Platform,${esc(config.name)}`);
    rows.push(`Title,${esc(result.title)}`);
    if (result.tags) rows.push(`Tags,${esc(result.tags.join(', '))}`);
    if (result.description) rows.push(`Description,${esc(result.description.replace(/\n/g, ' '))}`);
    if (result.bullets) result.bullets.forEach((b, i) => rows.push(`Bullet ${i + 1},${esc(b)}`));
    if (result.searchTerms) rows.push(`Search Terms,${esc(result.searchTerms)}`);
    if (result.metaTitle) rows.push(`Meta Title,${esc(result.metaTitle)}`);
    if (result.metaDescription) rows.push(`Meta Description,${esc(result.metaDescription)}`);
    if (result.urlHandle) rows.push(`URL Handle,${esc(result.urlHandle)}`);
    if (result.itemSpecifics) result.itemSpecifics.forEach((s) => rows.push(`${esc(s.label)},${esc(s.value)}`));
    content = rows.join('\n');
    mimeType = 'text/csv';
    extension = 'csv';
  } else {
    const lines: string[] = [
      `${config.name.toUpperCase()} SEO LISTING`,
      '='.repeat(40),
      '',
      `TITLE: ${result.title}`,
    ];
    if (result.tags) {
      lines.push('', `TAGS (${result.tags.length}):`, ...result.tags.map((t, i) => `  ${i + 1}. ${t}`));
    }
    if (result.description) lines.push('', 'DESCRIPTION:', result.description);
    if (result.bullets) {
      lines.push('', 'BULLET POINTS:', ...result.bullets.map((b, i) => `  ${i + 1}. ${b}`));
    }
    if (result.searchTerms) lines.push('', 'BACKEND SEARCH TERMS:', result.searchTerms);
    if (result.metaTitle) lines.push('', 'META TITLE:', result.metaTitle);
    if (result.metaDescription) lines.push('', 'META DESCRIPTION:', result.metaDescription);
    if (result.urlHandle) lines.push('', 'URL HANDLE:', result.urlHandle);
    if (result.itemSpecifics) {
      lines.push('', 'ITEM SPECIFICS:', ...result.itemSpecifics.map((s) => `  ${s.label}: ${s.value}`));
    }
    content = lines.join('\n');
    mimeType = 'text/plain';
    extension = 'txt';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${platform}-listing.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
