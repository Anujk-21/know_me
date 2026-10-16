import fs from 'node:fs';
import path from 'node:path';
import profile from '../data/profile.json';
import extra from '../data/extra-badges.json';

export interface Badge { id: string; name: string; issuer: string; image: string; issued: string; url: string }

const cachePath = path.resolve('src/data/credly-cache.json');

async function fetchLive(): Promise<Badge[] | null> {
  try {
    const r = await fetch(`https://www.credly.com/users/anujk/badges.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!r.ok || !(r.headers.get('content-type') ?? '').includes('json')) return null;
    const j: any = await r.json();
    const list: Badge[] = (j.data ?? [])
      .filter((b: any) => b.public !== false)
      .map((b: any) => ({
        id: String(b.id),
        name: b.badge_template?.name ?? b.name ?? 'Badge',
        issuer: b.issuer?.entities?.[0]?.entity?.name ?? b.badge_template?.issuer?.entities?.[0]?.entity?.name ?? 'Credly',
        image: b.image_url ?? b.badge_template?.image_url ?? '',
        issued: b.issued_at_date ?? b.issued_at ?? '',
        url: `https://www.credly.com/badges/${b.id}`,
      }));
    return list.length ? list : null;
  } catch {
    return null;
  }
}

function readCache(): Badge[] {
  try { return JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch { return []; }
}

export async function getBadges(): Promise<Badge[]> {
  let base = await fetchLive();
  if (base) {
    try { fs.writeFileSync(cachePath, JSON.stringify(base, null, 2)); } catch {}
  } else {
    base = readCache();
  }
  const seen = new Map<string, Badge>();
  for (const b of [...base, ...(extra as Badge[])]) {
    const k = b.id.toLowerCase();
    if (!seen.has(k)) seen.set(k, b);
  }
  const cert = /certified|certification/i;
  return [...seen.values()]
    .map((b) => ({ ...b, issuer: b.issuer.replace(' Training and Certification', '') }))
    .sort((a, b) => {
      const ca = cert.test(a.name) ? 1 : 0, cb = cert.test(b.name) ? 1 : 0;
      if (ca !== cb) return cb - ca;
      return +new Date(b.issued) - +new Date(a.issued);
    });
}