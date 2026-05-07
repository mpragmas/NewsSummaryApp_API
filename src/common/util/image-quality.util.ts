const BLOCKED_TOKENS = [
  'logo',
  'icon',
  'avatar',
  'placeholder',
  'default',
  'sprite',
  'favicon',
  'banner',
  'ads',
  'pixel',
  '1x1',
];

export function sanitizeImageUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  const candidate = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;

    const full = `${parsed.hostname}${parsed.pathname}`.toLowerCase();
    if (BLOCKED_TOKENS.some((token) => full.includes(token))) return null;
    if (full.endsWith('.svg')) return null;

    return parsed.toString();
  } catch {
    return null;
  }
}

export function dropOverusedImages<T extends { imageUrl: string | null }>(
  rows: T[],
  threshold = 4,
): T[] {
  const frequency = new Map<string, number>();
  for (const row of rows) {
    if (!row.imageUrl) continue;
    frequency.set(row.imageUrl, (frequency.get(row.imageUrl) ?? 0) + 1);
  }

  return rows.map((row) => {
    if (!row.imageUrl) return row;
    if ((frequency.get(row.imageUrl) ?? 0) < threshold) return row;
    return { ...row, imageUrl: null };
  });
}
