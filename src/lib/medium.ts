export interface Post { title: string; link: string; date: string; excerpt: string }

const strip = (s: string) =>
  s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();

export async function getPosts(user: string): Promise<Post[]> {
  try {
    const r = await fetch(`https://medium.com/feed/@${user}`);
    if (!r.ok) return [];
    const xml = await r.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);
    return items.map((m) => {
      const get = (tag: string) => m[1].match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))?.[1] ?? '';
      const body = strip(get('content:encoded') || get('description'));
      const d = new Date(get('pubDate'));
      return {
        title: strip(get('title')),
        link: strip(get('link')).split('?')[0],
        date: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        excerpt: body.length > 140 ? body.slice(0, 137).trimEnd() + '…' : body,
      };
    });
  } catch {
    return [];
  }
}