/** Explanatory texts (markdown) with their media references resolved to addresses before they leave the API. */
import type { DataSource } from "typeorm";

import { MEDIA_BASE, lastWord, shortCode, storedCode } from "./shared.ts";
import { legalChildren, legalContent } from "./legal-content.ts";
import { SUBJECT_PREFIX } from "./legal.ts";
import { valueLabel } from "#/modules/locality/features/places/reads/language.ts";

interface ContentRow {
  code: string;
  slug: string;
  language: string;
  title: string;
  summary: string | null;
  category: string;
  category_label: string;
  classification: string | null;
  classification_label: string | null;
  body: string;
  is_development_text: boolean;
  subject_table: string;
  subject_code: string | null;
}

const MEDIA_REF = /media:([A-Za-z0-9._-]+)/g;

/** Front matter (`---` lines of `key: value`) split from the markdown. */
export function splitFrontMatter(body: string): { meta: Record<string, string>; text: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(body);
  if (!match) return { meta: {}, text: body };
  const meta: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, text: body.slice(match[0].length) };
}

/** The address of every media code mentioned, stored bytes served from the media base, remote ones kept as they are. */
async function mediaUrls(db: DataSource, codes: readonly string[]): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  if (codes.length === 0) return found;
  const rows: { code: string; external_url: string | null; s3_key: string | null }[] = await db.query(
    `select m.code, m.external_url, fv.s3_key from filesystem.media m left join filesystem.file_versions fv on fv.id = m.file_version_id
     where m.code = any($1::text[]) and m.deleted_at is null`,
    [codes.map((c) => storedCode("fil.med", c))],
  );
  for (const r of rows) {
    const url = r.s3_key !== null ? `${MEDIA_BASE}/${r.s3_key.replace(/^media\//, "")}` : r.external_url;
    if (url) found.set(shortCode(r.code), url);
  }
  return found;
}

export interface ContentItem {
  code: string;
  slug: string;
  language: string;
  title: string;
  summary: string | null;
  category: { code: string; label: string };
  classification: { code: string; label: string } | null;
  body: string;
  image: string | null;
  frontMatter: Record<string, string>;
  tags: string[];
  isDevelopmentText: boolean;
  subject: { table: string; code: string | null };
  unresolvedMedia: string[];
}

const SLUG = `(select sl.slug from source.slugs sl where sl.subject_table = 'filesystem.contents' and sl.subject_id = c.id and sl.to_year is null limit 1)`;

const SELECT = (lang: string) => `select c.code, ${SLUG} as slug, l.iso6391 as language, c.title, c.summary, cat.code as category,
    ${valueLabel("cat.id", `'${lang}'`)} as category_label, cls.code as classification,
    case when cls.id is null then null else ${valueLabel("cls.id", `'${lang}'`)} end as classification_label,
    c.body, c.is_development_text, c.subject_table,
    case c.subject_table ${Object.entries(SUBJECT_PREFIX).map(([t]) => `when '${t}' then (select s.code from ${t} s where s.id = c.subject_id)`).join(" ")}
      end as subject_code
  from filesystem.contents c
  join reference.languages l on l.id = c.language_id
  join reference.values cat on cat.id = c.category_id
  left join reference.values cls on cls.id = c.classification_id`;

/** Resolve rows into items: front matter parsed, `media:<code>` replaced by addresses, tags attached. */
export async function toItems(db: DataSource, rows: ContentRow[], lang: string, withBody = true): Promise<ContentItem[]> {
  if (rows.length === 0) return [];
  const tagRows: { content: string; tag: string }[] = await db.query(
    `select c.code as content, t.title as tag from filesystem.content_tags ct join filesystem.contents c on c.id = ct.content_id
     join filesystem.tags t on t.id = ct.tag_id where c.code = any($1::text[]) order by t.title`,
    [rows.map((r) => r.code)],
  );
  const parsed = rows.map((r) => ({ row: r, ...splitFrontMatter(r.body) }));
  const wanted = new Set<string>();
  for (const p of parsed) {
    for (const m of p.text.matchAll(MEDIA_REF)) wanted.add(m[1]!);
    for (const v of Object.values(p.meta)) for (const m of v.matchAll(MEDIA_REF)) wanted.add(m[1]!);
  }
  const urls = await mediaUrls(db, [...wanted]);
  return parsed.map(({ row, meta, text }) => {
    const missing: string[] = [];
    const resolve = (s: string) => s.replace(MEDIA_REF, (whole, code: string) => {
      const url = urls.get(code);
      if (!url) missing.push(code);
      return url ?? whole;
    });
    const frontMatter = Object.fromEntries(Object.entries(meta).map(([k, v]) => [k, resolve(v)]));
    return {
      code: row.code.replace(/^fil\.co2\./, ""),
      slug: row.slug,
      language: row.language,
      title: row.title,
      summary: row.summary,
      category: { code: lastWord(row.category), label: row.category_label },
      classification: row.classification ? { code: lastWord(row.classification), label: row.classification_label! } : null,
      body: withBody ? resolve(text) : "",
      image: frontMatter.image ?? null,
      frontMatter,
      tags: tagRows.filter((t) => t.content === row.code).map((t) => t.tag),
      isDevelopmentText: row.is_development_text,
      subject: { table: row.subject_table, code: row.subject_code ? shortCode(row.subject_code) : null },
      unresolvedMedia: missing,
    };
  });
}

const langOf = (code: string | undefined): string => (code && /^[a-z]{2}$/.test(code) ? code : "en");

/** One text by address (in the language asked, else English) or the texts about one record. */
export async function getContent(
  db: DataSource,
  input: { slug?: string; subjectTable?: string; subjectCode?: string; languageCode?: string },
) {
  const lang = langOf(input.languageCode);
  if (input.slug?.startsWith("legal/")) return legalContent(db, input.slug.slice("legal/".length), lang);
  const gaps: string[] = [];
  let rows: ContentRow[] = [];
  if (input.slug) {
    rows = await db.query(`${SELECT(lang)} where ${SLUG} = $1 and c.deleted_at is null order by (l.iso6391 = '${lang}') desc limit 1`, [input.slug]);
  } else if (input.subjectTable && input.subjectCode && SUBJECT_PREFIX[input.subjectTable]) {
    rows = await db.query(
      `${SELECT(lang)} where c.deleted_at is null and c.subject_table = $1 and c.subject_id = (select s.id from ${input.subjectTable} s where (s.code = $2 or s.id::text = $3))
       order by (l.iso6391 = '${lang}') desc, c.code limit 6`,
      [input.subjectTable, storedCode(SUBJECT_PREFIX[input.subjectTable]!, input.subjectCode), input.subjectCode],
    );
  }
  if (rows.length === 0 && input.subjectTable === "geography.features" && input.subjectCode) {
    // a place without its own text is explained by the text about its kind of place (county, ward, ...)
    rows = await db.query(
      `${SELECT(lang)} join reference.values lv on lv.id = c.subject_id and c.subject_table = 'reference.values'
       join reference.value_relations vr on vr.source_value_id = lv.id and vr.relation_kind = 'related_to'
       where c.deleted_at is null and vr.target_value_id = (select f.feature_type_id from geography.features f where f.code = $1 or f.id::text = $2)
       order by (l.iso6391 = '${lang}') desc limit 1`,
      [storedCode("geo.ftr", input.subjectCode), input.subjectCode],
    );
  }
  const items = await toItems(db, rows, lang);
  if (items.length === 0) gaps.push("No explanatory text has been written for this yet.");
  const related = items[0]
    ? await listContent(db, { category: items[0].category.code, languageCode: lang, limit: 6 })
    : { items: [] };
  const subject = items[0]?.subject;
  const provisions = subject?.code ? await legalChildren(db, subject.table, subject.code, lang) : [];
  return {
    content: items[0] ?? null,
    related: [...provisions, ...related.items.filter((i) => i.slug !== items[0]?.slug)],
    gaps: [...gaps, ...items.flatMap((i) => i.unresolvedMedia.map((m) => `An image this text mentions (${m}) is not registered.`))],
  };
}

export async function listContent(
  db: DataSource,
  input: { category?: string; tag?: string; query?: string; languageCode?: string; limit?: number },
) {
  const lang = langOf(input.languageCode);
  const rows: ContentRow[] = await db.query(
    `select * from (${SELECT(lang)}
       where c.deleted_at is null and ($1::text is null or cat.code = 'ref.val.fil.content.category.' || $1)
         and ($2::text is null or exists (select 1 from filesystem.content_tags ct join filesystem.tags t on t.id = ct.tag_id
              where ct.content_id = c.id and (t.code = 'fil.tag.ke.tag.' || $2 or lower(t.title) = lower($2))))
         and ($3::text is null or c.title ilike '%' || $3 || '%' or c.summary ilike '%' || $3 || '%')
     ) q order by (q.language = '${lang}') desc, q.title limit $4`,
    [input.category ?? null, input.tag ?? null, input.query ?? null, Math.min(input.limit ?? 60, 200)],
  );
  const picked = new Map<string, ContentRow>();
  for (const r of rows) if (!picked.has(r.slug)) picked.set(r.slug, r);
  const items = await toItems(db, [...picked.values()], lang, false);
  const cats: { code: string; label: string; n: string }[] = await db.query(
    `select v.code, ${valueLabel("v.id", `'${lang}'`)} as label, (select count(*) from filesystem.contents c where c.category_id = v.id and c.deleted_at is null) as n
     from reference.values v join reference.schemes s on s.id = v.scheme_id where s.code = 'ref.sch.fil.content.category' order by v.position nulls last, v.code`,
  );
  return {
    items,
    categories: cats.filter((c) => Number(c.n) > 0).map((c) => ({ code: lastWord(c.code), label: c.label, count: Number(c.n) })),
    gaps: items.length === 0 ? ["Nothing matches. Try another category or tag."] : [],
  };
}
