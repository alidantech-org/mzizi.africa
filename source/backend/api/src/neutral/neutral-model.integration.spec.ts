/// <reference types="vite/client" />
import "reflect-metadata";

import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { grantReadOnly, scratchDatabase, synchronizeDomainSchemas } from "#/database/scratch-database";
import { FindElectionsUseCase } from "#/modules/elections/elections-read/use-cases/find-elections.usecase";
import { FindBudgetsUseCase } from "#/modules/finance/finance-read/use-cases/find-budgets.usecase";
import { FindFiscalYearsUseCase } from "#/modules/finance/finance-read/use-cases/find-fiscal-years.usecase";
import { GetGeographyHierarchyUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-hierarchy.usecase";
import { FindOfficeRulesUseCase } from "#/modules/governance/governance-read/use-cases/find-office-rules.usecase";
import { FindSelectionProceduresUseCase } from "#/modules/governance/governance-read/use-cases/find-selection-procedures.usecase";
import { FindSelectionStagesUseCase } from "#/modules/governance/governance-read/use-cases/find-selection-stages.usecase";
import { FindClassificationRecordsUseCase } from "#/modules/reference/reference-read/use-cases/find-classification-records.usecase";
import { FindJurisdictionsUseCase } from "#/modules/reference/reference-read/use-cases/find-jurisdictions.usecase";
import { FindFormatsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-formats.usecase";
import { loadFixtures, readFixture } from "#/neutral/fixture-loader";

/**
 * The model is country-neutral if two structurally different countries load as records over one
 * schema with no schema change, and each reads back its own structure. Fixtures:
 * source/backend/engine/database/fixtures/neutral-model (Kenya and South Africa).
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const READER = "mzizi_neutral_reader";
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));

type Page<K extends string, T = Record<string, any>> = Record<K, T[]>;

describe.skipIf(!adminUrl)("country-neutral model (Kenya and South Africa)", () => {
  let admin: DataSource;
  let reader: DataSource;
  let ids: Map<string, string>;

  const labels = async (country: string, scheme: string) => {
    const result = (await new FindClassificationRecordsUseCase(reader).execute({ jurisdictionId: ids.get(country), scheme, limit: 50 } as never)) as never as Page<"records">;
    return result.records.sort((a, b) => a.order - b.order).map((record) => record.label);
  };

  beforeAll(async () => {
    const dbUrl = await scratchDatabase(adminUrl as string, "mzizi_test");
    admin = new DataSource({ type: "postgres", url: dbUrl, entities, synchronize: false });
    await admin.initialize();
    await synchronizeDomainSchemas(admin);
    ids = await loadFixtures(admin, readFixture("reference/media-formats").rows);
    await loadFixtures(admin, readFixture("kenya").rows, ids);
    await loadFixtures(admin, readFixture("south-africa").rows, ids);

    await admin.query(`DO $$ BEGIN IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${READER}') THEN DROP OWNED BY ${READER}; DROP ROLE ${READER}; END IF; END $$`);
    await admin.query(`CREATE ROLE ${READER} LOGIN PASSWORD 'pw'`);
    await grantReadOnly(admin, READER);
    const url = new URL(dbUrl);
    url.username = READER;
    url.password = "pw";
    reader = new DataSource({ type: "postgres", url: url.toString(), entities });
    await reader.initialize();
  });

  afterAll(async () => {
    await reader?.destroy();
    await admin?.query(`DROP OWNED BY ${READER}`);
    await admin?.query(`DROP ROLE IF EXISTS ${READER}`);
    await admin?.destroy();
  });

  it("seeds media formats from the archived file types", async () => {
    const formats = (await new FindFormatsUseCase(reader).execute({ code: "pdf" } as never)) as never as Page<"formats">;
    expect(formats.formats[0]).toMatchObject({ mimeType: "application/pdf", category: "document" });
  });

  it("holds both countries as jurisdictions in one schema", async () => {
    const result = (await new FindJurisdictionsUseCase(reader).execute({} as never)) as never as Page<"jurisdictions">;
    expect(result.jurisdictions.map((item) => item.code).sort()).toEqual(["ke", "za"]);
  });

  it("carries each country's place hierarchy as classification records, not columns", async () => {
    expect(await labels("ke", "geography/level")).toEqual(["country", "county", "ward"]);
    expect(await labels("za", "geography/level")).toEqual(["country", "province", "municipality"]);
    const ward = (await new GetGeographyHierarchyUseCase(reader).execute({ entityId: ids.get("ke:unit:westlands") as string })) as never as Page<"ancestors">;
    expect(ward.ancestors.map((item) => item.code)).toEqual(["ke", "ke/nairobi"]);
    const municipality = (await new GetGeographyHierarchyUseCase(reader).execute({ entityId: ids.get("za:unit:ct") as string })) as never as Page<"ancestors">;
    expect(municipality.ancestors.map((item) => item.code)).toEqual(["za", "za/western-cape"]);
  });

  it("carries each country's vocabularies independently", async () => {
    expect(await labels("ke", "finance/workflow-stage")).toEqual(["requisition", "commitment", "verification", "payment"]);
    expect(await labels("za", "finance/workflow-stage")).toEqual(["appropriation", "release", "expenditure"]);
    expect(await labels("ke", "elections/election-type")).toEqual(["general election"]);
    expect(await labels("za", "elections/election-type")).toEqual(["general election by closed-list proportional representation"]);
  });

  it("models how the head of state is selected: direct election versus choice by the legislature", async () => {
    const stages = async (country: string) => {
      const procedures = (await new FindSelectionProceduresUseCase(reader).execute({ officeId: ids.get(`${country}:office:president`) } as never)) as never as Page<"procedures">;
      expect(procedures.procedures).toHaveLength(1);
      const result = (await new FindSelectionStagesUseCase(reader).execute({ procedureId: procedures.procedures[0]?.id } as never)) as never as Page<"stages">;
      return result.stages.sort((a, b) => a.stageOrder - b.stageOrder).map((stage) => stage.kind);
    };
    expect(await stages("ke")).toEqual(["election"]);
    expect(await stages("za")).toEqual(["nomination", "election"]);
  });

  it("keeps office rules as dated records scoped to the office", async () => {
    for (const country of ["ke", "za"]) {
      const rules = (await new FindOfficeRulesUseCase(reader).execute({ officeId: ids.get(`${country}:office:president`) } as never)) as never as Page<"rules">;
      const byKind = Object.fromEntries(rules.rules.map((rule) => [rule.kind, Number(rule.numericValue)]));
      expect(byKind).toEqual({ max_terms: 2, term_length_years: 5 });
    }
  });

  it("represents different fiscal calendars and currencies without defaults", async () => {
    const year = async (country: string) => ((await new FindFiscalYearsUseCase(reader).execute({ jurisdictionId: ids.get(country) } as never)) as never as Page<"fiscalYears">).fiscalYears[0];
    expect(await year("ke")).toMatchObject({ startsOn: "2025-07-01", endsOn: "2026-06-30" });
    expect(await year("za")).toMatchObject({ startsOn: "2025-04-01", endsOn: "2026-03-31" });
    const budget = async (country: string) => ((await new FindBudgetsUseCase(reader).execute({ unitId: ids.get(`${country}:bunit`) } as never)) as never as Page<"budgets">).budgets[0];
    expect(await budget("ke")).toMatchObject({ currencyCode: "KES" });
    expect(await budget("za")).toMatchObject({ currencyCode: "ZAR" });
  });

  it("does not leak one country's records into another's queries", async () => {
    const elections = async (country: string) => ((await new FindElectionsUseCase(reader).execute({ jurisdictionId: ids.get(country) } as never)) as never as Page<"elections">).elections.map((item) => item.code);
    expect(await elections("ke")).toEqual(["ke/2022-general"]);
    expect(await elections("za")).toEqual(["za/2024-general"]);
  });

  it("needed no country-specific column or enum value in the schema", () => {
    const terms = new Set(["county", "province", "ward", "municipality", "constituency", "kenya", "africa", "iebc", "kra", "pin", "president", "governor", "ke", "za"]);
    const countrySpecific = { test: (text: string) => text.toLowerCase().split(/[^a-z0-9]+/).some((token) => terms.has(token)) };
    const offenders: string[] = [];
    for (const meta of admin.entityMetadatas) {
      for (const column of meta.columns) {
        if (countrySpecific.test(column.databaseName)) offenders.push(`${meta.tableName}.${column.databaseName}`);
        for (const value of column.enum ?? []) if (countrySpecific.test(String(value))) offenders.push(`${meta.tableName}.${column.databaseName}=${value}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
