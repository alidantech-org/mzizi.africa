/** Public bodies: the directory grouped by arm and kind (every group and label read from the reference schemes), and one body's profile. */
import type { DataSource } from "typeorm";

import { activeGovernance, activeInstitution, activeMandate } from "./governance-active.ts";
import { getContent } from "./content.ts";
import { legalBasis, type LegalItem } from "./legal.ts";
import { lastWord, mediaFor, personName, partyOf, shortCode, storedCode } from "./shared.ts";
import { featureName, valueLabel } from "#/modules/locality/features/places/reads/language.ts";

/** A parent with at least this many children stands for a family of look-alikes (47 county governments, 290 NG-CDF committees). */
const BULK = 40;

export const langOf = (code: string | undefined): string => (code && /^[a-z]{2}$/.test(code) ? code : "en");

interface Row {
  id: string; code: string; name: string; kind: string; kind_label: string; arm: string | null; arm_label: string | null; arm_pos: number | null;
  basis: string | null; basis_label: string | null; parent_code: string | null; parent_name: string | null; leaders: string; children: string;
  purpose: string | null; established: string | null;
}

const PURPOSE = `(select m.description from governance.mandates m join reference.values mk on mk.id = m.mandate_kind_id
    where m.institution_id = i.id and ${activeMandate()} and mk.code = 'ref.val.gov.mandate.kind.purpose' limit 1)`;
const NAME = (alias: string) => `(select n.name from official.names n where n.entity_id = ${alias}.entity_id order by n.is_preferred desc, n.name limit 1)`;

const baseSelect = (lang: string) => `select i.id, i.code, ${NAME("i")} as name, kv.code as kind, ${valueLabel("kv.id", `'${lang}'`)} as kind_label,
    av.code as arm, case when av.id is null then null else ${valueLabel("av.id", `'${lang}'`)} end as arm_label, av.position as arm_pos,
    bv.code as basis, case when bv.id is null then null else ${valueLabel("bv.id", `'${lang}'`)} end as basis_label,
    pi.code as parent_code, ${NAME("pi")} as parent_name,
    (select count(*) from governance.holders h join governance.offices o on o.id = h.office_id where o.institution_id = i.id and ${activeGovernance()}) as leaders,
    (select count(*) from governance.relationships r join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.gov.relationship.kind.part-of' join governance.institutions s on s.id = r.subject_institution_id where r.object_institution_id = i.id and r.deleted_at is null and ${activeInstitution('s')}) as children,
    ${PURPOSE} as purpose, i.established_on::text as established
  from governance.institutions i
  join reference.values kv on kv.id = i.institution_kind_id
  left join reference.values av on av.id = i.arm_id
  left join reference.values bv on bv.id = i.establishment_basis_id
  left join lateral (select p.* from governance.relationships r join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.gov.relationship.kind.part-of'
    join governance.institutions p on p.id = r.object_institution_id where r.subject_institution_id = i.id and r.deleted_at is null and ${activeInstitution("p")} limit 1) pi on true
  where ${activeInstitution()}`;

const card = (r: Row, logos: Map<string, string>) => ({
  code: shortCode(r.code), name: r.name, kind: { code: lastWord(r.kind), label: r.kind_label },
  arm: r.arm ? { code: lastWord(r.arm), label: r.arm_label! } : null,
  basis: r.basis ? { code: lastWord(r.basis), label: r.basis_label! } : null,
  parent: r.parent_code ? { code: shortCode(r.parent_code), name: r.parent_name } : null,
  leaders: Number(r.leaders), children: Number(r.children), purpose: r.purpose, image: logos.get(r.id) ?? null,
});

async function logos(db: DataSource, ids: string[]): Promise<Map<string, string>> {
  const media = await mediaFor(db, "governance.institutions", ids, 1);
  return new Map([...media].map(([id, list]) => [id, list[0]!.url]));
}

export async function listInstitutions(db: DataSource, input: { armCode?: string; kindCode?: string; query?: string }, lang = "en") {
  const rows: Row[] = await db.query(`${baseSelect(lang)} order by av.position nulls last, ${NAME("i")}`);
  const bulky = new Set(rows.filter((r) => Number(r.children) >= BULK).map((r) => r.code));
  const hidden = new Set<string>();
  for (const r of rows) if (r.parent_code && bulky.has(r.parent_code)) hidden.add(r.code);
  for (const r of rows) if (r.parent_code && hidden.has(r.parent_code)) hidden.add(r.code);
  const q = input.query?.toLowerCase();
  const shown = rows.filter((r) =>
    !hidden.has(r.code) && (!input.armCode || (r.arm && lastWord(r.arm) === input.armCode)) && (!input.kindCode || lastWord(r.kind) === input.kindCode) &&
    (!q || r.name.toLowerCase().includes(q) || (r.purpose ?? "").toLowerCase().includes(q)));
  const images = await logos(db, shown.map((r) => r.id));
  const arms = new Map<string, { code: string; label: string; position: number; count: number; groups: Map<string, { kind: { code: string; label: string }; institutions: ReturnType<typeof card>[] }> }>();
  for (const r of shown) {
    const key = r.arm ?? "none";
    const arm = arms.get(key) ?? { code: r.arm ? lastWord(r.arm) : "other", label: r.arm_label ?? "Other bodies", position: r.arm_pos ?? 999, count: 0, groups: new Map() };
    const group = arm.groups.get(r.kind) ?? { kind: { code: lastWord(r.kind), label: r.kind_label }, institutions: [] };
    group.institutions.push(card(r, images));
    arm.groups.set(r.kind, group);
    arm.count += 1;
    arms.set(key, arm);
  }
  const abouts: Record<string, string>[] = await db.query(
    `select v.code, c.summary from filesystem.contents c join reference.values v on c.subject_table = 'reference.values' and v.id = c.subject_id where v.code like 'ref.val.gov.arm.%' and c.deleted_at is null`);
  const about = new Map(abouts.map((a) => [lastWord(a.code!), a.summary!]));
  const out = [...arms.values()].sort((a, b) => a.position - b.position).map((a) => ({
    code: a.code, label: a.label, about: about.get(a.code) ?? null, count: a.count,
    groups: [...a.groups.values()].sort((x, y) => x.kind.label.localeCompare(y.kind.label)),
  }));
  return { arms: out, total: shown.length, gaps: shown.length === 0 ? ["No body matches. Clear the filters to see them all."] : [] };
}

export async function getInstitutionRow(db: DataSource, code: string, lang: string): Promise<Row | undefined> {
  const exact: Row[] = await db.query(`${baseSelect(lang)} and i.code = $1`, [storedCode("gov.ins", code)]);
  if (exact[0]) return exact[0];
  // A short name is usable only when it identifies one body, without assuming a jurisdiction.
  const matches: Row[] = await db.query(`${baseSelect(lang)} and right(i.code, length($1::text) + 1) = '.' || $1 limit 2`, [code]);
  return matches.length === 1 ? matches[0] : undefined;
}

export interface HolderRow {
  holder_id: string; individual_id: string; name: string; party: string | null; office_code: string; tier: string; tier_label: string; tier_parent: string | null;
  how: string; how_label: string; unit_id: string | null; unit: string | null; unit_kind: string | null; took: string | null; inst_code: string; inst_name: string; tier_pos: number | null;
}

/** Current holders of the offices of some institutions (or of any institution when none is given), filtered further by the caller. */
export const holderSelect = (lang: string) => `select h.id as holder_id, h.individual_id, ${personName("h.individual_id")} as name, ${partyOf("h.individual_id")} as party,
    o.code as office_code, tk.code as tier, ${valueLabel("tk.id", `'${lang}'`)} as tier_label, tp.code as tier_parent,
    ak.code as how, ${valueLabel("ak.id", `'${lang}'`)} as how_label, o.unit_feature_id as unit_id,
    case when o.unit_feature_id is null then null else ${featureName("o.unit_feature_id", `'${lang}'`)} end as unit,
    (select k.code from geography.features f join reference.values k on k.id = f.feature_type_id where f.id = o.unit_feature_id) as unit_kind,
    h.took_office_on::text as took, i.code as inst_code, ${NAME("i")} as inst_name, tk.position as tier_pos
  from governance.holders h
  join governance.offices o on o.id = h.office_id
  join governance.institutions i on i.id = o.institution_id
  join reference.values tk on tk.id = o.office_kind_id
  left join reference.values tp on tp.id = tk.parent_id
  join reference.values ak on ak.id = h.appointment_kind_id
  where ${activeGovernance()}`;

export async function getInstitution(db: DataSource, code: string, lang = "en") {
  const row = await getInstitutionRow(db, code, lang);
  if (!row) return null;
  const gaps: string[] = [];
  const images = await logos(db, [row.id]);
  const holders: HolderRow[] = await db.query(`${holderSelect(lang)} and i.id = $1 order by tk.position nulls last, o.code limit 200`, [row.id]);
  const media = await mediaFor(db, "official.individuals", holders.map((h) => h.individual_id), 1);
  const mandates: { kind: string; description: string }[] = await db.query(
    `select mk.code as kind, m.description from governance.mandates m join reference.values mk on mk.id = m.mandate_kind_id where m.institution_id = $1 and ${activeMandate()} order by m.description`, [row.id]);
  const relRows: { dir: string; code: string; name: string; rel: string; rel_label: string; children: string }[] = await db.query(
    `select 'out' as dir, o.code, ${NAME("o")} as name, rk.code as rel, ${valueLabel("rk.id", `'${lang}'`)} as rel_label, '0' as children
       from governance.relationships r join governance.institutions o on o.id = r.object_institution_id join reference.values rk on rk.id = r.relationship_kind_id where r.subject_institution_id = $1 and r.deleted_at is null and ${activeInstitution("o")}
     union all
     select 'in', s.code, ${NAME("s")}, rk.code, ${valueLabel("rk.id", `'${lang}'`)},
       (select count(*) from governance.relationships r2 join governance.institutions p on p.id = r2.subject_institution_id where r2.object_institution_id = s.id and r2.deleted_at is null and ${activeInstitution("p")})::text
       from governance.relationships r join governance.institutions s on s.id = r.subject_institution_id join reference.values rk on rk.id = r.relationship_kind_id where r.object_institution_id = $1 and r.deleted_at is null and ${activeInstitution("s")}
     order by 5, 3`, [row.id]);
  const rel = (r: (typeof relRows)[number]) => ({ code: shortCode(r.code), name: r.name, relation: { code: lastWord(r.rel), label: r.rel_label }, children: Number(r.children) });
  const incoming = relRows.filter((r) => r.dir === "in");
  const effects: LegalItem[] = await legalBasis(db, [{ table: "governance.institutions", code: shortCode(row.code) }], lang);
  const statutes = mandates.filter((m) => m.kind.endsWith(".legal-basis") && !/^Articles? \d/.test(m.description)).map((m) => ({
    type: "act", effect: "Established or governed by", instrument: m.description, designation: "", heading: null, excerpt: "", reviewStatus: "stated", provisionCode: null, instrumentCode: null,
  }));
  const content = await getContent(db, { subjectTable: "governance.institutions", subjectCode: shortCode(row.code), languageCode: lang });
  if (effects.length === 0 && statutes.length === 0) gaps.push("No law is recorded as creating or governing this body yet.");
  if (holders.length === 0) gaps.push("No current leader is recorded for this body.");
  return {
    institution: {
      ...card(row, images), established: row.established,
      purpose: mandates.find((m) => m.kind.endsWith(".purpose"))?.description ?? row.purpose,
      functions: mandates.filter((m) => m.kind.endsWith(".function")).map((m) => m.description),
    },
    leaders: holders.map((h) => ({
      holderId: h.holder_id, name: h.name, party: h.party, tier: { code: lastWord(h.tier), label: h.tier_label, parent: h.tier_parent ? lastWord(h.tier_parent) : null },
      how: { code: lastWord(h.how), label: h.how_label }, unit: h.unit_id ? { featureId: h.unit_id, name: h.unit } : null, since: h.took,
      photo: media.get(h.individual_id)?.[0]?.url ?? null, officeCode: shortCode(h.office_code),
    })),
    legalBasis: [...effects.map((e) => ({ type: e.instrumentCode.includes("constitution") ? "constitution" : "act", ...e })), ...statutes],
    content: content.content ? [content.content] : [],
    parents: relRows.filter((r) => r.dir === "out").map(rel),
    children: incoming.slice(0, 60).map(rel),
    metrics: [
      { label: "Leaders in office", value: Number(row.leaders) },
      { label: "Bodies that belong to it or answer to it", value: incoming.length },
    ],
    gaps,
  };
}
