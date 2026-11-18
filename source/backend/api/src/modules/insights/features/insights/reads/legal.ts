/** The legal basis of a record: the provisions (Constitution articles, Acts) whose reviewed effects name it, read from `legal.effects`. */
import type { DataSource } from "typeorm";

import { shortCode, storedCode } from "./shared.ts";
import { valueLabel } from "#/modules/locality/features/places/reads/language.ts";

/** The tables an effect may point at, with the stored-code prefix of each. Only these are queried by name. */
export const SUBJECT_PREFIX: Record<string, string> = {
  "governance.institutions": "gov.ins",
  "governance.offices": "gov.ofs",
  "governance.holders": "gov.hld",
  "reference.values": "ref.val",
  "geography.features": "geo.ftr",
  "legal.instruments": "leg.ins",
  "official.individuals": "ofc.ind",
};

export interface LegalItem {
  effect: string;
  effectCode: string;
  provisionCode: string;
  designation: string;
  heading: string | null;
  instrument: string;
  instrumentCode: string;
  excerpt: string;
  explanation: string | null;
  reviewStatus: string;
  via: string | null;
}

/** Effects on one subject (optionally also on related reference values, such as the office kind of an office). */
export async function legalBasis(
  db: DataSource,
  subjects: readonly { table: string; code: string; via?: string }[],
  lang = "en",
): Promise<LegalItem[]> {
  const items: LegalItem[] = [];
  const seen = new Set<string>();
  for (const subject of subjects) {
    const prefix = SUBJECT_PREFIX[subject.table];
    if (prefix === undefined) continue;
    const rows: Record<string, string | null>[] = await db.query(
      `select e.code as effect_code, ${valueLabel("e.kind_id", "$3")} as effect, p.code as provision_code, p.designation,
         p.title as heading, i.code as instrument_code,
         coalesce((select n.name from legal.names n where n.instrument_id = i.id order by n.is_preferred desc, n.name limit 1), i.code) as instrument,
         left(w.text, 400) as excerpt, e.explanation, e.review_status
       from legal.effects e
       join legal.wordings w on w.id = e.wording_id
       join legal.provisions p on p.id = w.provision_id
       join legal.instruments i on i.id = p.instrument_id
       where e.subject_table = $1 and e.deleted_at is null
         and e.subject_id = (select s.id from ${subject.table} s where (s.code = $2 or s.id::text = $4))
       order by p.position nulls last, p.code`,
      [subject.table, storedCode(prefix, subject.code), lang, subject.code],
    );
    for (const r of rows) {
      if (seen.has(r.effect_code!)) continue;
      seen.add(r.effect_code!);
      items.push({
        effect: r.effect!,
        effectCode: shortCode(r.effect_code!),
        provisionCode: shortCode(r.provision_code!),
        designation: r.designation!,
        heading: r.heading,
        instrument: r.instrument!,
        instrumentCode: shortCode(r.instrument_code!),
        excerpt: r.excerpt ?? "",
        explanation: r.explanation,
        reviewStatus: r.review_status!,
        via: subject.via ?? null,
      });
    }
  }
  return items;
}

/** The legal basis of a record. For an office or a leader that is the basis of the kind of office and of the body it sits in. */
export async function legalBasisFor(db: DataSource, table: string, code: string, lang = "en"): Promise<LegalItem[]> {
  if (table === "governance.holders" || table === "governance.offices") {
    const rows: { tier: string; inst: string }[] = await db.query(
      table === "governance.holders"
        ? `select tk.code as tier, i.code as inst from governance.holders h join governance.offices o on o.id = h.office_id join reference.values tk on tk.id = o.office_kind_id
           join governance.institutions i on i.id = o.institution_id where (h.code = $1 or h.id::text = $2) and h.deleted_at is null`
        : `select tk.code as tier, i.code as inst from governance.offices o join reference.values tk on tk.id = o.office_kind_id join governance.institutions i on i.id = o.institution_id where (o.code = $1 or o.id::text = $2) and o.deleted_at is null`,
      [storedCode(SUBJECT_PREFIX[table]!, code), code],
    );
    const r = rows[0];
    if (!r) return [];
    return legalBasis(db, [{ table, code }, { table: "reference.values", code: shortCode(r.tier), via: "The office" }, { table: "governance.institutions", code: shortCode(r.inst), via: "The body it sits in" }], lang);
  }
  return legalBasis(db, [{ table, code }], lang);
}
