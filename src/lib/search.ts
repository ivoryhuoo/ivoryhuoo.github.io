import { BUILDINGS, type Building, type BuildingId } from '../data/buildings';

/**
 * Buildings matching a search, best matches first: name, then summary and
 * description, then keywords. Landmarks and the building you're in are left out.
 */
export function searchBuildings(query: string, exclude?: BuildingId): Building[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // Match at the start of a word, so "td" finds TD but not "ou(td)oor".
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordStart = new RegExp('(^|[^a-z0-9])' + escaped);
  const scored: Array<{ b: Building; score: number }> = [];
  for (const b of BUILDINGS) {
    if (b.kind !== 'building' || b.status !== 'open' || b.id === exclude) continue;
    const name = b.name.toLowerCase();
    let score = 0;
    if (name.startsWith(q)) score = 4;
    else if (name.includes(q)) score = 3;
    else if (b.keywords.some((k) => wordStart.test(k.toLowerCase()))) score = 2;
    else if (wordStart.test(`${b.summary} ${b.inside}`.toLowerCase())) score = 1;
    if (score) scored.push({ b, score });
  }
  return scored.sort((a, c) => c.score - a.score).map((s) => s.b);
}
