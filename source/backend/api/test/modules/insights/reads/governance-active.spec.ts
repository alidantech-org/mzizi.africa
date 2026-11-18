/** Execute current-visibility predicates against PostgreSQL date boundaries without mutating development data. */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { activeHolder, activeInstitution, activeMandate, activeOffice } from "#/modules/insights/features/insights/reads/governance-active.ts";

const url = process.env.TEST_DATABASE_URL;
interface VisibilityRow { name: string; expected: boolean; holder: boolean; office: boolean; institution: boolean; mandate: boolean }

describe.skipIf(url === undefined)("current governance visibility (PostgreSQL)", () => {
  let db: DataSource;
  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url });
    await db.initialize();
  });
  afterAll(async () => { await db.destroy(); });

  it("excludes future starts and exact ended dates but includes scheduled future ends and unknown dates", async () => {
    const rows: VisibilityRow[] = await db.query(`
      with cases(name, starts, ends, from_year, to_year, deleted_at, expected) as (values
        ('unknown', null::date, null::date, null::int, null::int, null::timestamptz, true),
        ('starts-today', current_date, null, null, null, null, true),
        ('future-start', current_date + 1, null, null, null, null, false),
        ('future-end', current_date - 1, current_date + 1, null, null, null, true),
        ('ends-today', current_date - 1, current_date, null, null, null, false),
        ('ended', current_date - 2, current_date - 1, null, null, null, false),
        ('future-year', null, null, extract(year from current_date)::int + 1, null, null, false),
        ('past-year', null, null, null, extract(year from current_date)::int - 1, null, false),
        ('uncertain-current-year-end', null, null, null, extract(year from current_date)::int, null, true),
        ('exact-start-priority', current_date + 1, null, extract(year from current_date)::int - 1, null, null, false),
        ('exact-end-priority', current_date - 1, current_date + 1, null, extract(year from current_date)::int - 1, null, true),
        ('deleted', null, null, null, null, current_timestamp, false)
      ), h as (select *, starts as took_office_on, ends as left_office_on from cases),
      o as (select *, starts as created_on, ends as abolished_on from cases),
      i as (select *, starts as established_on, ends as dissolved_on from cases),
      m as (select *, starts as starts_on, ends as ends_on from cases)
      select h.name, h.expected, (${activeHolder()}) as holder, (${activeOffice()}) as office,
        (${activeInstitution()}) as institution, (${activeMandate()}) as mandate
      from h join o using(name) join i using(name) join m using(name) order by h.name`);
    expect(rows).toHaveLength(12);
    for (const row of rows) {
      expect(row.holder, `${row.name}: holder`).toBe(row.expected);
      expect(row.office, `${row.name}: office`).toBe(row.expected);
      expect(row.institution, `${row.name}: institution`).toBe(row.expected);
      expect(row.mandate, `${row.name}: mandate`).toBe(row.expected);
    }
  });
});
