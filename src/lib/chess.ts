export async function getChess(user: string): Promise<{ label: string; value: string }[] | null> {
  try {
    const r = await fetch(`https://api.chess.com/pub/player/${user}/stats`, {
      headers: { 'User-Agent': 'know_me-portfolio (anujkaroddeo@gmail.com)' },
    });
    if (!r.ok || !(r.headers.get('content-type') ?? '').includes('json')) return null;
    const j: any = await r.json();
    const out = [
      ['Rapid', j.chess_rapid?.last?.rating],
      ['Blitz', j.chess_blitz?.last?.rating],
      ['Bullet', j.chess_bullet?.last?.rating],
      ['Puzzles (best)', j.tactics?.highest?.rating],
    ]
      .filter(([, v]) => typeof v === 'number')
      .map(([label, v]) => ({ label: label as string, value: String(v) }));
    return out.length ? out : null;
  } catch {
    return null;
  }
}