/** The lists behind finance, politics and coverage. Each says what is missing instead of returning an empty page. */
import type { DataSource } from "typeorm";

import { featureName, valueLabel } from "#/modules/locality/features/places/reads/language.ts";
import { entityName, shortCode } from "#/modules/insights/features/insights/reads/shared.ts";

const LANG = "'en'";

export async function budgets(db: DataSource, limit: number) {
  const rows: Record<string, unknown>[] = await db.query(
    `select b.code, ${valueLabel("b.budget_kind_id", LANG)} as kind, ${entityName("b.government_entity_id")} as entity,
            fp.starts_on::text as fiscal_from, fp.ends_on::text as fiscal_to,
            (select count(*) from finance.budget_versions v where v.budget_id = b.id and v.deleted_at is null) as revisions,
            (select max(v.released_on)::text from finance.budget_versions v where v.budget_id = b.id and v.deleted_at is null) as latest
       from finance.budgets b left join finance.fiscal_periods fp on fp.id = b.fiscal_period_id
      where b.deleted_at is null order by fp.starts_on desc nulls last, b.code limit $1`,
    [limit],
  );
  return {
    budgets: rows.map((r) => ({
      code: shortCode(String(r.code)), kind: String(r.kind), entity: (r.entity as string | null) ?? null,
      fiscalFrom: (r.fiscal_from as string | null) ?? null, fiscalTo: (r.fiscal_to as string | null) ?? null,
      revisions: Number(r.revisions), latestReleasedOn: (r.latest as string | null) ?? null,
    })),
    gaps: rows.length === 0 ? ["No budgets are recorded yet."] : [],
  };
}

export async function funds(db: DataSource, limit: number) {
  const rows: Record<string, unknown>[] = await db.query(
    `select f.code, ${valueLabel("f.fund_kind_id", LANG)} as kind, ${valueLabel("f.funding_source_id", LANG)} as source,
            ${entityName("f.managing_entity_id")} as manager, ${featureName("f.scope_unit_feature_id", LANG)} as place,
            (select count(*) from finance.flows fl where fl.fund_id = f.id and fl.deleted_at is null) as flows,
            f.scope_unit_feature_id as "featureId"
       from finance.funds f where f.deleted_at is null order by f.code limit $1`,
    [limit],
  );
  const total: { n: string }[] = await db.query("select count(*)::text as n from finance.funds where deleted_at is null");
  return {
    funds: rows.map((r) => ({
      code: shortCode(String(r.code)), kind: String(r.kind), source: (r.source as string | null) ?? null,
      manager: (r.manager as string | null) ?? null, place: (r.place as string | null) ?? null,
      featureId: r.featureId, flows: Number(r.flows),
    })),
    total: Number(total[0]?.n ?? 0),
    gaps: rows.length === 0 ? ["No funds are recorded yet."] : [],
  };
}

export async function coverage(db: DataSource) {
  const rows: Record<string, unknown>[] = await db.query(
    `select c.code, ${valueLabel("c.coverage_subject_id", LANG)} as subject, ${valueLabel("c.level_id", LANG)} as level,
            (select s.title from source.sources s where s.id = c.source_id) as source, c.note, c.checked_on::text as checked_on,
            c.expected_publication_url as expected_at
       from source.coverage c where c.deleted_at is null order by c.code`,
  );
  return {
    items: rows.map((r) => ({
      code: shortCode(String(r.code)), subject: String(r.subject), level: (r.level as string | null) ?? null,
      source: (r.source as string | null) ?? null, note: (r.note as string | null) ?? null,
      checkedOn: (r.checked_on as string | null) ?? null, expectedAt: (r.expected_at as string | null) ?? null,
    })),
    gaps: rows.length === 0 ? ["Nothing has been checked yet, so what is missing is not known either."] : [],
  };
}

export async function coalitions(db: DataSource) {
  const rows: Record<string, unknown>[] = await db.query(
    `select c.code, c.name, ${valueLabel("c.coalition_kind_id", LANG)} as kind, c.formed_on::text as formed_on, c.dissolved_on::text as dissolved_on
       from politics.coalitions c where c.deleted_at is null order by c.formed_on desc nulls last, c.name`,
  );
  return {
    coalitions: rows.map((r) => ({
      code: shortCode(String(r.code)), name: String(r.name), kind: String(r.kind),
      formedOn: (r.formed_on as string | null) ?? null, dissolvedOn: (r.dissolved_on as string | null) ?? null,
    })),
    gaps: rows.length === 0 ? ["No coalitions are recorded yet. They will appear with their member parties once a published source is added."] : [],
  };
}

export async function manifestos(db: DataSource) {
  const rows: Record<string, unknown>[] = await db.query(
    `select m.code, ${entityName("(select p.entity_id from politics.parties p where p.id = m.party_id)")} as party,
            (select e.code from politics.elections e where e.id = m.election_id) as election, m.published_on::text as published_on
       from politics.manifestos m where m.deleted_at is null order by m.published_on desc nulls last, m.code`,
  );
  return {
    manifestos: rows.map((r) => ({
      code: shortCode(String(r.code)), party: (r.party as string | null) ?? null,
      election: r.election ? shortCode(String(r.election)) : null, publishedOn: (r.published_on as string | null) ?? null,
    })),
    gaps: rows.length === 0 ? ["No manifestos are recorded yet. A manifesto is added with its document and the election it was written for."] : [],
  };
}
