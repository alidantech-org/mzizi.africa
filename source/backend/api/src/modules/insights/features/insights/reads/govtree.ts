/**
 * The governance tree. Which leaders belong to a tab (elected, nominated, appointed) comes from reference value
 * relations; the bodies they sit in, the arm each body belongs to and the order of tiers come from the institution and
 * reference tables. Nothing about Kenya is listed here: the tree is built from rows.
 */
import type { DataSource } from "typeorm";

import { activeGovernance, activeInstitution, activeMandate } from "./governance-active.ts";
import { crumbs, lastWord, mediaFor, shortCode, storedCode, entityName } from "./shared.ts";
import { holderSelect, langOf, listInstitutions, type HolderRow } from "./institutions.ts";
import { valueLabel } from "#/modules/locality/features/places/reads/language.ts";

interface Tab { code: string; label: string; about: string | null; kinds: string[] }

async function tabs(db: DataSource, lang: string): Promise<Tab[]> {
  const rows: { code: string; label: string; about: string | null; kinds: string[] }[] = await db.query(
    `select t.code, ${valueLabel("t.id", `'${lang}'`)} as label,
       (select c.summary from filesystem.contents c where c.subject_table = 'reference.values' and c.subject_id = t.id and c.deleted_at is null
          order by (select l.iso6391 = '${lang}' from reference.languages l where l.id = c.language_id) desc limit 1) as about,
       array(select k.code from reference.value_relations vr join reference.values k on k.id = vr.target_value_id
         where vr.source_value_id = t.id and vr.relation_kind = 'broader_than') as kinds
     from reference.values t join reference.schemes s on s.id = t.scheme_id where s.code = 'ref.sch.gov.leader.tab' order by t.position nulls last, t.code`);
  return rows.map((r) => ({ code: lastWord(r.code), label: r.label, about: r.about, kinds: r.kinds }));
}

export async function governanceTabs(db: DataSource, lang = "en") {
  const list = await tabs(db, lang);
  const counts: { kind: string; n: string }[] = await db.query(
    `select ak.code as kind, count(*) as n from governance.holders h join governance.offices o on o.id = h.office_id join governance.institutions i on i.id = o.institution_id join reference.values ak on ak.id = h.appointment_kind_id where ${activeGovernance()} group by 1`);
  const per = new Map(counts.map((c) => [c.kind, Number(c.n)]));
  const directory = await listInstitutions(db, {}, lang);
  return {
    tabs: list.map((t) => ({ code: t.code, label: t.label, about: t.about, kind: "appointment", count: t.kinds.reduce((a, k) => a + (per.get(k) ?? 0), 0), includes: t.kinds.map(lastWord) })),
    arms: directory.arms.map((a) => ({
      code: a.code, label: a.label, about: a.about,
      institutions: a.groups.flatMap((g) => g.institutions).filter((i) => i.leaders > 0 || i.children > 0).map((i) => ({ code: i.code, name: i.name, leaders: i.leaders, kind: i.kind, image: i.image })),
    })),
    gaps: list.length === 0 ? ["No ways of grouping leaders are defined yet."] : [],
  };
}

interface Perf { holder_id: string; score: number; basis: string; rank: number; of: number; n: number }

/** One score per leader and tier: attendance at recorded votes where they vote, else the share of completed projects in their area. */
async function performance(db: DataSource, ids: string[]): Promise<Map<string, Perf>> {
  if (ids.length === 0) return new Map();
  const rows: Perf[] = await db.query(
    `with att as (select h.id, 100 * count(*) filter (where p.code not like '%.absent')::float8 / count(*) as v, count(*) as n from governance.holders h
         join governance.votes v on v.holder_id = h.id join reference.values p on p.id = v.position_id group by h.id having count(*) >= 1),
       comp as (select p.scope_unit_feature_id as uid, 100 * count(*) filter (where s.code like '%.completed')::float8 / count(*) as v, count(*) as n
         from civic.projects p join reference.values s on s.id = p.status_id where p.scope_unit_feature_id is not null group by 1 having count(*) >= 2),
       scored as (select h.id as holder_id, (select p.title_id from governance.positions p where p.id = o.position_id) as office_kind_id, coalesce(att.v, comp.v) as score, coalesce(att.n, comp.n) as n,
           case when att.v is not null then 'attendance' when comp.v is not null then 'projects' end as basis
         from governance.holders h join governance.offices o on o.id = h.office_id join governance.institutions i on i.id = o.institution_id left join att on att.id = h.id left join comp on comp.uid = o.unit_feature_id
         where ${activeGovernance()}),
       ranked as (select holder_id, score, basis, n::int as n, rank() over (partition by office_kind_id, basis order by score desc)::int as rank, count(*) over (partition by office_kind_id, basis)::int as of
         from scored where score is not null)
     select * from ranked where holder_id = any($1::uuid[])`, [ids]);
  return new Map(rows.map((r) => [r.holder_id, { ...r, score: Number(r.score) }]));
}

const basisText = (basis: string, score: number, n: number): string =>
  basis === "attendance" ? `Recorded vote participation: ${score.toFixed(0)}% of ${n} vote${n === 1 ? "" : "s"}` : `Area project completion: ${score.toFixed(0)}% of ${n} recorded projects`;

export async function governanceTree(db: DataSource, input: { tab?: string; institution?: string; featureId?: string }, lang = "en") {
  const language = langOf(lang);
  const gaps: string[] = [];
  const tabList = await tabs(db, language);
  const tab = tabList.find((t) => t.code === input.tab) ?? tabList[0];
  if (!tab) return {
    tab: null, place: null, nodes: [], edges: [], rail: [], legend: [],
    gaps: ["No ways of grouping leaders are defined yet."],
  };
  if (input.tab && !tabList.some((t) => t.code === input.tab)) return {
    tab: null, place: null, nodes: [], edges: [], rail: [], legend: [],
    gaps: ["That leader category is not recorded. Choose an available category."],
  };
  const chain = input.featureId ? await crumbs(db, input.featureId, language) : [];
  const chainIds = chain.map((c) => c.featureId);
  let rows: HolderRow[];
  let scopeInstitution: string | null = null;
  if (input.institution) {
    scopeInstitution = storedCode("gov.ins", input.institution);
    rows = await db.query(
      `with recursive down as (select i.id from governance.institutions i where i.code = $1 and ${activeInstitution()}
         union select r.subject_institution_id from governance.relationships r join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.gov.relationship.kind.part-of'
           join down d on d.id = r.object_institution_id join governance.institutions s on s.id = r.subject_institution_id
           where r.deleted_at is null and ${activeInstitution("s")})
       ${holderSelect(language)} and i.id in (select id from down)
         and ($2::text[] is null or ak.code = any($2::text[]))
       order by tk.position nulls last, o.code limit 400`, [scopeInstitution, input.tab ? tab.kinds : null]);
  } else {
    rows = await db.query(
      `${holderSelect(language)} and ak.code = any($1::text[])
         and (o.unit_feature_id is null or o.unit_feature_id = any($2::uuid[]) or o.unit_feature_id in
              (select f.id from geography.features f join reference.values k on k.id = f.feature_type_id where k.code like '%.country'))
       order by tk.position nulls last, o.code limit 800`, [tab.kinds, chainIds]);
    if (!input.featureId && tab.code === "elected") gaps.push("Choose your place to see the governor, senator, representative, MP and MCA who serve you.");
  }
  const media = await mediaFor(db, "official.individuals", rows.map((r) => r.individual_id), 1);
  const perf = await performance(db, rows.map((r) => r.holder_id));
  // bodies: the institutions of these leaders and every ancestor, with their arm
  const instCodes = [...new Set(rows.map((r) => r.inst_code))];
  const bodies: { code: string; name: string; parent: string | null; arm: string | null; arm_label: string | null; basis_label: string | null; kind_label: string; purpose: string | null }[] = await db.query(
    `with recursive up as (select i.id, i.code from governance.institutions i where i.code = any($1::text[]) and ${activeInstitution()}
       union select p.id, p.code from up u join governance.relationships r on r.subject_institution_id = u.id
         join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.gov.relationship.kind.part-of' join governance.institutions p on p.id = r.object_institution_id where r.deleted_at is null and ${activeInstitution("p")})
     select i.code, ${entityName("i.entity_id")} as name,
       (select p.code from governance.relationships r join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.gov.relationship.kind.part-of'
          join governance.institutions p on p.id = r.object_institution_id where r.subject_institution_id = i.id and r.deleted_at is null and ${activeInstitution("p")} limit 1) as parent,
       av.code as arm, case when av.id is null then null else ${valueLabel("av.id", `'${language}'`)} end as arm_label,
       case when bv.id is null then null else ${valueLabel("bv.id", `'${language}'`)} end as basis_label, ${valueLabel("kv.id", `'${language}'`)} as kind_label,
       (select m.description from governance.mandates m join reference.values mk on mk.id = m.mandate_kind_id where m.institution_id = i.id and ${activeMandate()} and mk.code = 'ref.val.gov.mandate.kind.purpose' limit 1) as purpose
     from up join governance.institutions i on i.id = up.id join reference.values kv on kv.id = i.institution_kind_id
       left join reference.values av on av.id = i.arm_id left join reference.values bv on bv.id = i.establishment_basis_id`, [instCodes.length ? instCodes : ["-"]]);
  const armsRows: { code: string; label: string; position: number | null }[] = await db.query(
    `select v.code, ${valueLabel("v.id", `'${language}'`)} as label, v.position from reference.values v join reference.schemes s on s.id = v.scheme_id where s.code = 'ref.sch.gov.arm' order by v.position nulls last`);
  const levels: { code: string; label: string; about: string | null; kind: string | null }[] = await db.query(
    `select v.code, ${valueLabel("v.id", `'${language}'`)} as label,
       (select c.summary from filesystem.contents c where c.subject_table = 'reference.values' and c.subject_id = v.id and c.deleted_at is null limit 1) as about,
       (select t.code from reference.value_relations vr join reference.values t on t.id = vr.target_value_id where vr.source_value_id = v.id and vr.relation_kind = 'related_to' limit 1) as kind
     from reference.values v join reference.schemes s on s.id = v.scheme_id where s.code = 'ref.sch.gov.level' order by v.position nulls last`);
  const nodes: Record<string, unknown>[] = [];
  const edges: { from: string; to: string; kind: string }[] = [];
  const levelOf = (kind: string | null) => levels.find((l) => l.kind === kind)?.code.split(".").at(-1) ?? "country";
  const root = scopeInstitution === null ? "root" : null;
  const country = chain[0];
  if (root) nodes.push({ id: root, type: "root", name: country?.name ?? tab.label, level: "country", refs: { scheme: "ref.sch.gov.arm" } });
  // arms
  const armUsed = new Set(bodies.map((b) => b.arm).filter((a): a is string => a !== null));
  if (root) for (const a of armsRows) if (armUsed.has(a.code)) {
    nodes.push({ id: `a:${a.code}`, type: "arm", name: a.label, level: "country", refs: { value: shortCode(a.code), scheme: "gov.arm" } });
    edges.push({ from: root, to: `a:${a.code}`, kind: "arm" });
  }
  const byCode = new Map(bodies.map((b) => [b.code, b]));
  const holdersByInst = new Map<string, HolderRow[]>();
  for (const r of rows) holdersByInst.set(r.inst_code, [...(holdersByInst.get(r.inst_code) ?? []), r]);
  for (const b of bodies) {
    const mine = holdersByInst.get(b.code) ?? [];
    const lvl = mine.length ? levelOf(mine[0]!.unit_kind) : "country";
    nodes.push({
      id: `i:${b.code}`, type: "body", name: b.name, level: lvl, purpose: b.purpose, kind: b.kind_label, arm: b.arm_label, basis: b.basis_label, leaders: mine.length,
      code: shortCode(b.code), refs: { table: "governance.institutions", code: shortCode(b.code), scheme: "gov.arm", basis: b.basis_label },
    });
    const parent = b.parent && byCode.has(b.parent) ? `i:${b.parent}` : null;
    if (parent) edges.push({ from: parent, to: `i:${b.code}`, kind: "part-of" });
    else if (root && b.arm) edges.push({ from: `a:${b.arm}`, to: `i:${b.code}`, kind: "arm" });
    else if (root) edges.push({ from: root, to: `i:${b.code}`, kind: "arm" });
  }
  // leaders: under their superior tier when it is in view, else under their body
  const tierOf = new Map<string, HolderRow[]>();
  for (const r of rows) tierOf.set(lastWord(r.tier), [...(tierOf.get(lastWord(r.tier)) ?? []), r]);
  for (const r of rows) {
    const p = perf.get(r.holder_id);
    const id = `h:${r.holder_id}`;
    nodes.push({
      id, type: "leader", holderId: r.holder_id, name: r.name, party: r.party, photo: media.get(r.individual_id)?.[0]?.url ?? null, since: r.took,
      tier: { code: lastWord(r.tier), label: r.tier_label, position: r.tier_pos },
      how: { code: lastWord(r.how), label: r.how_label }, unit: r.unit_id ? { featureId: r.unit_id, name: r.unit } : null,
      level: levelOf(r.unit_kind), body: { code: shortCode(r.inst_code), name: r.inst_name },
      performance: p ? { score: Math.round(p.score * 10) / 10, basis: p.basis, rank: p.rank, of: p.of, samples: p.n, text: basisText(p.basis, p.score, p.n) } : null,
      refs: { table: "governance.holders", office: shortCode(r.office_code), tier: `gov.office.kind.${lastWord(r.tier)}`, appointment: `gov.appointment.kind.${lastWord(r.how)}`, institution: shortCode(r.inst_code), scheme: "gov.office.kind" },
    });
  }
  for (const r of rows) {
    const id = `h:${r.holder_id}`;
    const parentTier = r.tier_parent ? lastWord(r.tier_parent) : null;
    const candidates = parentTier ? tierOf.get(parentTier) ?? [] : [];
    // A tier relation is not authority to attach an office to an unrelated area's leader.
    const parent = candidates.find((c) => c.inst_code === r.inst_code && c.unit_id === r.unit_id)
      ?? candidates.find((c) => c.unit_id !== null && c.unit_id === r.unit_id);
    if (parent && parent.holder_id !== r.holder_id) edges.push({ from: `h:${parent.holder_id}`, to: id, kind: "reports" });
    else edges.push({ from: `i:${r.inst_code}`, to: id, kind: "member" });
  }
  if (rows.length === 0) gaps.push(input.institution ? "No leader is recorded for this body." : "No leaders are recorded for this view.");
  const missingPerf = rows.filter((r) => !perf.has(r.holder_id)).length;
  if (missingPerf > 0) gaps.push(`${missingPerf} of ${rows.length} leaders have no performance bar: no recorded votes or projects for their role.`);
  const rail = levels.map((l) => {
    const code = l.code.split(".").at(-1)!;
    const here = chain.find((c) => l.kind !== null && c.kindCode === l.kind);
    return {
      code, label: l.label, about: l.about, count: nodes.filter((n) => n.type === "leader" && n.level === code).length,
      unit: code === "country" ? chain[0] ?? null : here ?? null, refs: { table: "reference.values", code: `gov.level.${code}`, kind: l.kind },
    };
  });
  return {
    tab: { code: tab.code, label: tab.label, about: tab.about, institution: input.institution ?? null },
    place: chain.at(-1) ?? null, nodes, edges, rail,
    legend: [{ code: "reports", label: "Reports to or works under" }, { code: "member", label: "Member or office-holder of the body" }, { code: "part-of", label: "Body is part of the body above" }, { code: "arm", label: "Belongs to the arm of government above" }],
    gaps,
  };
}
