/**
 * Procurement for the units of a place: public projects scoped to a unit, their procurement and the contract awarded.
 * Amounts are stored in minor units and returned in major units with the currency's code.
 */
import type { DataSource } from "typeorm";
import { entityName } from "./language.ts";

import type { ProcurementItem } from "#/modules/locality/schema/interface/procurement-item.interface.ts";
import type { ProcurementSummary } from "#/modules/locality/schema/interface/procurement-summary.interface.ts";
import { evidenceFor } from "#/modules/locality/features/places/reads/evidence.ts";

/** How many recent items a place document lists. */
const RECENT = 5;

interface ItemRow {
  procurement_id: string;
  title: string;
  status: string | null;
  amount: string | null;
  currency: string | null;
  awarded_to: string | null;
  year: number | null;
}

interface TotalRow {
  count: string;
  total: string | null;
  currency: string | null;
}

const ITEM_FROM = `from civic.projects p
  join civic.procurements pr on pr.project_id = p.id
  left join civic.contracts ct on ct.procurement_id = pr.id
  left join reference.values st on st.id = ct.status_id
  left join reference.values cur on cur.id = ct.currency_id
  where p.scope_unit_feature_id = any($1::uuid[])`;

export async function procurementFor(
  db: DataSource,
  unitIds: readonly string[],
): Promise<ProcurementSummary> {
  if (unitIds.length === 0) return { count: 0, totalAmount: null, currency: null, recent: [] };
  const totals: TotalRow[] = await db.query(
    `select count(distinct pr.id)::text as count, (sum(ct.amount_minor_units) / 100.0)::text as total,
       max(upper(regexp_replace(cur.code, '^.*\\.', ''))) as currency ${ITEM_FROM}`,
    [unitIds],
  );
  const rows: ItemRow[] = await db.query(
    `select pr.id as procurement_id, p.name as title, regexp_replace(st.code, '^.*\\.', '') as status,
       (ct.amount_minor_units / 100.0)::text as amount, upper(regexp_replace(cur.code, '^.*\\.', '')) as currency,
       ${entityName("ct.contractor_entity_id")} as awarded_to,
       extract(year from pr.published_on)::int as year
     ${ITEM_FROM}
     order by array_position($1::uuid[], p.scope_unit_feature_id) desc, pr.published_on desc nulls last, pr.code
     limit ${RECENT}`,
    [unitIds],
  );
  const evidence = await evidenceFor(
    db,
    "civic.procurements",
    rows.map((row) => row.procurement_id),
  );
  const recent: ProcurementItem[] = rows.map((row) => ({
    procurementId: row.procurement_id,
    title: row.title,
    status: row.status,
    amount: row.amount === null ? null : Number(row.amount),
    currency: row.currency,
    awardedTo: row.awarded_to,
    year: row.year,
    evidence: evidence.get(row.procurement_id) ?? [],
  }));
  const total = totals[0];
  return {
    count: Number(total?.count ?? 0),
    totalAmount: total?.total == null ? null : Number(total.total),
    currency: total?.currency ?? null,
    recent,
  };
}
