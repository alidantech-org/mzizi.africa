/** Read stored legal provisions through the existing content document, with child links for chapter/article navigation. */
import type { DataSource } from "typeorm";
import type { ContentItem } from "./content.ts";
import { shortCode, storedCode } from "./shared.ts";

interface ProvisionRow {
  code: string;
  designation: string;
  title: string | null;
  kind: string;
  text: string | null;
  language: string | null;
  instrument: string;
  instrument_name: string;
  parent_code: string | null;
  citation_id: string | null;
}

const SELECT = `select p.code, p.designation, p.title, p.kind, w.text, w.language, w.citation_id, i.code as instrument,
  coalesce((select n.name from legal.names n where n.instrument_id = i.id order by n.is_preferred desc limit 1), i.code) as instrument_name,
  (select parent.code from legal.provisions parent where parent.id = p.parent_id) as parent_code
  from legal.provisions p join legal.instruments i on i.id = p.instrument_id
  left join lateral (
    select w.text, w.citation_id::text as citation_id, l.iso6391 as language from legal.wordings w join reference.languages l on l.id = w.language_id
    where w.provision_id = p.id and w.deleted_at is null and w.ends_on is null
    order by (l.iso6391 = $1) desc, w.starts_on desc nulls last, w.code limit 1
  ) w on true`;

function item(row: ProvisionRow): ContentItem {
  return {
    code: shortCode(row.code), slug: `legal/${shortCode(row.code)}`, language: row.language ?? "",
    title: row.title ? `${row.designation} — ${row.title}` : row.designation,
    summary: row.instrument_name, category: { code: row.kind, label: row.kind }, classification: null,
    body: row.text ?? "", image: null,
    frontMatter: {
      ...(row.parent_code ? { parent: `legal/${shortCode(row.parent_code)}` } : {}),
      ...(row.citation_id ? { citationId: row.citation_id } : {}),
    },
    tags: [], isDevelopmentText: false, subject: { table: "legal.provisions", code: shortCode(row.code) }, unresolvedMedia: [],
  };
}

export async function legalContent(db: DataSource, code: string, lang: string) {
  const rows: ProvisionRow[] = await db.query(`${SELECT} where p.code = $2 and p.deleted_at is null and i.deleted_at is null`,
    [lang, storedCode("leg.prv", code)]);
  if (!rows[0]) return { content: null, related: [], gaps: ["That legal provision is not recorded."] };
  const related = await legalChildren(db, "legal.provisions", shortCode(rows[0].code), lang);
  const content = item(rows[0]);
  const parts = rows[0].kind === "article" || rows[0].kind === "preamble"
    ? await legalDescendants(db, rows[0].code, lang) : [];
  if (parts.length > 0) {
    content.body = [content.body, ...parts.map((part) =>
      `### ${part.designation}${part.title ? ` — ${part.title}` : ""}\n\n${part.text ?? ""}`)].join("\n\n");
    content.frontMatter.sourceProvisions = [rows[0], ...parts].map((part) => shortCode(part.code)).join(",");
    content.frontMatter.citationIds = [...new Set([rows[0], ...parts].flatMap((part) => part.citation_id ? [part.citation_id] : []))].join(",");
  }
  return { content, related, gaps: [
    ...(parts.some((part) => part.text === null) ? ["Some child provisions have no recorded wording."] : []),
    ...(parts.some((part) => part.language && part.language !== lang) ? ["Some child provisions are shown in their stored language."] : []),
    ...(!content.body && related.length === 0 ? ["No wording is recorded for this provision."] : []),
    ...(content.language && content.language !== lang ? ["The requested language is unavailable; the stored wording is shown."] : []),
  ] };
}

export async function legalChildren(db: DataSource, table: string, code: string, lang: string): Promise<ContentItem[]> {
  if (table !== "legal.instruments" && table !== "legal.provisions") return [];
  const condition = table === "legal.instruments"
    ? "i.code = $2 and p.parent_id is null"
    : "p.parent_id = (select parent.id from legal.provisions parent where parent.code = $2)";
  const rows: ProvisionRow[] = await db.query(`${SELECT} where ${condition} and p.deleted_at is null and i.deleted_at is null order by p.position nulls last, p.code`,
    [lang, storedCode(table === "legal.instruments" ? "leg.ins" : "leg.prv", code)]);
  return rows.map(item);
}

/** Article/preamble readers see the stored clauses together, in source order, without rewriting their wording. */
async function legalDescendants(db: DataSource, code: string, lang: string): Promise<ProvisionRow[]> {
  return db.query(`with recursive descendants as (
    select p.id, array[p.id] as visited, array[coalesce(p.position, 0)] as sequence
      from legal.provisions p where p.parent_id = (select root.id from legal.provisions root where root.code = $2)
        and p.deleted_at is null
    union all
    select p.id, d.visited || p.id, d.sequence || coalesce(p.position, 0)
      from legal.provisions p join descendants d on p.parent_id = d.id
      where p.deleted_at is null and not p.id = any(d.visited)
  ) ${SELECT} join descendants d on d.id = p.id
    where i.deleted_at is null order by d.sequence, p.code`, [lang, code]);
}
