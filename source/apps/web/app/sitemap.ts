import type { MetadataRoute } from "next";

import { browse, elections, parties } from "#/lib/site/insights.ts";
import { electionAt } from "#/lib/site/links.ts";

export const dynamic = "force-dynamic";

/** Sections that exist at country level; each also exists under a place. */
const SECTIONS = ["", "explore", "places", "elections", "leaders", "calendar", "politics/parties", "government/institutions", "government/law", "government/parliament", "procurement/tenders", "finance", "infrastructure", "data/statistics", "data/rankings", "data/compare", "data/sources"];

/** The canonical addresses: the country sections, every election, every party and the places down to the second level. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? "http://localhost:3300";
  const urls = new Set<string>(SECTIONS.map((s) => `/${s}`));
  const [root, list, partyList] = await Promise.all([browse().catch(() => null), elections().catch(() => null), parties().catch(() => null)]);
  for (const e of list?.elections ?? []) urls.add(electionAt(e));
  for (const p of partyList?.parties ?? []) urls.add(`/politics/parties/${p.code}`);
  const counties = root?.children ?? [];
  for (const c of counties) {
    if (!c.path) continue;
    urls.add(`/${c.path}`);
    const inside = await browse(c.featureId).catch(() => null);
    for (const child of inside?.children ?? []) if (child.path) urls.add(`/${child.path}`);
  }
  return [...urls].map((u) => ({ url: `${site}${u === "/" ? "" : u}`, changeFrequency: "weekly" as const }));
}
