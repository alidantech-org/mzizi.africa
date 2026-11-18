/** One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is. */
import type { DataSource } from "typeorm";

import { crumbs, mediaFor, MEDIA_BASE } from "./shared.ts";

interface Hit {
  kind: string;
  kindLabel: string;
  id: string;
  code: string | null;
  title: string;
  subtitle: string | null;
  path: string[];
  featureId: string | null;
  imageUrl: string | null;
  rank: number;
}

const rankOf = (title: string, q: string): number => {
  const t = title.toLowerCase();
  const needle = q.toLowerCase();
  return t === needle ? 0 : t.startsWith(needle) ? 1 : t.split(/\s+/).some((w) => w.startsWith(needle)) ? 2 : 3;
};

export const SEARCH_KINDS = ["place", "leader", "party", "project", "tender", "indicator", "source", "law"] as const;

export async function globalSearch(
  db: DataSource,
  query: string,
  kinds: string | undefined,
  limit: number,
) {
  const q = query.trim();
  const wanted = new Set((kinds ? kinds.split(",") : SEARCH_KINDS).map((k) => k.trim()));
  const per = Math.min(Math.max(limit, 5), 60);
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const hits: Hit[] = [];
  const counts: Record<string, number> = {};
  const add = (kind: string, label: string, rows: { id: string; code?: string | null; title: string; subtitle?: string | null; feature_id?: string | null; total: string }[]) => {
    counts[kind] = rows.length === 0 ? 0 : Number(rows[0]!.total);
    for (const row of rows) {
      hits.push({ kind, kindLabel: label, id: row.id, code: row.code ?? null, title: row.title, subtitle: row.subtitle ?? null, path: [], featureId: row.feature_id ?? null, imageUrl: null, rank: rankOf(row.title, q) });
    }
  };
  const run = async (kind: string, label: string, sql: string) => {
    if (wanted.has(kind)) add(kind, label, await db.query(sql, [like, per]));
  };
  await run("place", "Place", `
    select * from (select distinct on (f.id) f.id, f.code, n.name as title, k.label as subtitle, f.id as feature_id, count(*) over () as total
      from geography.names n join geography.features f on f.id = n.feature_id join reference.values k on k.id = f.feature_type_id
      where n.name ilike $1 order by f.id, n.is_default desc) x order by length(title), title limit $2`);
  await run("leader", "Leader", `
    select * from (select distinct on (i.id) h.id, i.code, n.name as title,
        (select k.label from reference.values k where k.id = o.office_kind_id) || ', ' ||
        coalesce((select n2.name from geography.names n2 where n2.feature_id = o.unit_feature_id and n2.is_default limit 1), '') as subtitle,
        o.unit_feature_id as feature_id, count(*) over () as total
      from official.names n join official.individuals i on i.id = n.individual_id
      join governance.holders h on h.individual_id = i.id and h.left_office_on is null
      join governance.offices o on o.id = h.office_id
      where n.name ilike $1 order by i.id, h.took_office_on desc nulls last) x order by length(title), title limit $2`);
  await run("party", "Party", `
    select * from (select pt.id, pt.code, n.name as title, 'Political party' as subtitle, null::uuid as feature_id, count(*) over () as total
      from politics.parties pt join official.names n on n.entity_id = pt.entity_id where n.name ilike $1) x order by length(title), title limit $2`);
  await run("project", "Project", `
    select p.id, p.code, p.name as title, (select k.label from reference.values k where k.id = p.status_id) as subtitle, p.scope_unit_feature_id as feature_id, count(*) over () as total
    from civic.projects p where p.name ilike $1 order by length(p.name), p.name limit $2`);
  await run("tender", "Tender", `
    select p.id, p.code, coalesce(p.title, p.code) as title, (select k.label from reference.values k where k.id = p.status_id) as subtitle, null::uuid as feature_id, count(*) over () as total
    from civic.procurements p where p.title ilike $1 or p.reference ilike $1 order by length(coalesce(p.title, p.code)) limit $2`);
  await run("indicator", "Statistic", `
    select i.id, i.code, i.name as title, (select t.label from reference.topics t where t.id = i.topic_id) as subtitle, null::uuid as feature_id, count(*) over () as total
    from statistics.indicators i where i.name ilike $1 or i.description ilike $1 order by i.name limit $2`);
  await run("source", "Source", `
    select s.id, s.code, s.title, s.kind as subtitle, null::uuid as feature_id, count(*) over () as total
    from source.sources s where s.title ilike $1 order by s.title limit $2`);
  await run("law", "Law", `
    select i.id, i.code, n.name as title, 'Legal instrument' as subtitle, null::uuid as feature_id, count(*) over () as total
    from legal.names n join legal.instruments i on i.id = n.instrument_id where n.name ilike $1 order by length(n.name) limit $2`);
  hits.sort((a, b) => a.rank - b.rank || a.title.length - b.title.length);
  const top = hits.slice(0, per);
  await Promise.all(
    top.map(async (hit) => {
      if (hit.featureId !== null) {
        const chain = await crumbs(db, hit.featureId);
        hit.path = chain.map((c) => c.name);
      }
    }),
  );
  const leaders = top.filter((h) => h.kind === "leader");
  if (leaders.length > 0) {
    const people: { holder_id: string; individual_id: string }[] = await db.query(
      "select h.id as holder_id, h.individual_id from governance.holders h where h.id = any($1::uuid[])",
      [leaders.map((l) => l.id)],
    );
    const media = await mediaFor(db, "official.individuals", people.map((p) => p.individual_id), 1);
    for (const p of people) {
      const item = media.get(p.individual_id)?.[0];
      const hit = leaders.find((l) => l.id === p.holder_id);
      if (hit && item) hit.imageUrl = item.url;
    }
  }
  void MEDIA_BASE;
  return {
    query: q,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    counts,
    hits: top.map(({ rank, ...rest }) => ({ ...rest, rank })).map(({ rank: _rank, ...hit }) => hit),
  };
}
