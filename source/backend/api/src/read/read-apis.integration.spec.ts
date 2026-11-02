/// <reference types="vite/client" />
import "reflect-metadata";

import { NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { grantReadOnly, scratchDatabase, synchronizeDomainSchemas } from "#/database/scratch-database";
import { GetChildBoundariesUseCase } from "#/modules/geography/geography-read/use-cases/get-child-boundaries.usecase";
import { GetGeographyBoundaryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-boundary.usecase";
import { GetGeographyEntityUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-entity.usecase";
import { SearchGeographyUseCase } from "#/modules/geography/geography-read/use-cases/search-geography.usecase";
import { GetGeographyHierarchyUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-hierarchy.usecase";
import { GetGeographyHistoryUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-history.usecase";
import { GetGeographyMapContextUseCase } from "#/modules/geography/geography-read/use-cases/get-geography-map-context.usecase";
import { ListBoundariesByLevelUseCase } from "#/modules/geography/geography-read/use-cases/list-boundaries-by-level.usecase";
import { GetGeographyGovernanceUseCase } from "#/modules/governance/governance-read/use-cases/get-geography-governance.usecase";
import { FindLegalInstrumentsUseCase } from "#/modules/legal/legal-read/use-cases/find-legal-instruments.usecase";
import { GetLegalInstrumentByIdUseCase } from "#/modules/legal/legal-read/use-cases/get-legal-instrument-by-id.usecase";
import { FindFileAttachmentsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-file-attachments.usecase";
import { FindFileVersionsUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-file-versions.usecase";
import { FindFilesUseCase } from "#/modules/filesystem/filesystem-read/use-cases/find-files.usecase";
import { GetFileByIdUseCase } from "#/modules/filesystem/filesystem-read/use-cases/get-file-by-id.usecase";
import { FindPersonContactsUseCase } from "#/modules/person/person-read/use-cases/find-person-contacts.usecase";
import { FindPersonHandlesUseCase } from "#/modules/person/person-read/use-cases/find-person-handles.usecase";
import { GetPersonContactByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-contact-by-id.usecase";
import { FindBudgetsUseCase } from "#/modules/finance/finance-read/use-cases/find-budgets.usecase";

/**
 * Project-owned integration test for the read APIs across domains, on a real PostgreSQL
 * (TEST_DATABASE_URL, a PostGIS server). Everything is read through a SELECT-only role.
 */
const adminUrl = process.env.TEST_DATABASE_URL;
const READER = "mzizi_read_apis_reader";
const entities = Object.values(
  import.meta.glob("../modules/*/entities/*.entity.ts", { eager: true }) as Record<string, Record<string, Function>>,
).flatMap((module) => Object.values(module));
const entity = (name: string) => entities.find((candidate) => candidate.name === name) as never;

type Page<K extends string> = Record<K, Array<Record<string, any>>>;
const polygon = JSON.stringify({ type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] });

describe.skipIf(!adminUrl)("read APIs (PostgreSQL, read-only role)", () => {
  let admin: DataSource;
  let reader: DataSource;
  const ids: Record<string, string> = {};

  const fact = (extra: Record<string, unknown> = {}) => ({
    isCurrent: true,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...extra,
  });
  const save = async (name: string, key: string, values: Record<string, unknown>) => {
    const saved = await admin.getRepository(entity(name)).save(admin.getRepository(entity(name)).create(values as never));
    ids[key] = (saved as unknown as { id: string }).id;
    return saved as unknown as { id: string };
  };

  beforeAll(async () => {
    const dbUrl = await scratchDatabase(adminUrl as string, "mzizi_test");
    admin = new DataSource({ type: "postgres", url: dbUrl, entities, synchronize: false });
    await admin.initialize();
    await synchronizeDomainSchemas(admin);

    await save("JurisdictionEntity", "ke", fact({ code: "ke", name: "Kenya", kind: "modern_state" }));
    await save("JurisdictionEntity", "polity", fact({ code: "example-realm", name: "Example Realm", kind: "historical_polity" }));
    for (const [key, label, order] of [["lvlCountry", "country", 0], ["lvlCounty", "county", 1], ["lvlWard", "ward", 2]] as const) {
      await save("ClassificationRecordEntity", key, fact({ jurisdictionId: ids.ke, scheme: "geography/level", code: `geography/${label}`, label, order }));
    }

    // Legal: one instrument with a superseded version and a current one.
    await save("LegalInstrumentEntity", "instrOld", fact({ jurisdictionId: ids.ke, code: "ke/constitution-1963", title: "Constitution 1963", kindId: ids.ke, status: "superseded", isCurrent: false }));
    await save("LegalInstrumentEntity", "instrNew", fact({ jurisdictionId: ids.ke, code: "ke/constitution-2010", title: "Constitution 2010", kindId: ids.ke, status: "in_force" }));

    // Geography: country > county (verified) with two wards (one verified, one not), plus a sibling county.
    const unit = (key: string, code: string, name: string, level: string, parent: string | null, extra: Record<string, unknown> = {}) =>
      save("GeoUnitEntity", key, fact({ jurisdictionId: ids.ke, levelId: ids[level], parentId: parent ? ids[parent] : null, code, name, kind: "territorial", isActive: true, ...extra }));
    await unit("country", "ke", "Kenya", "lvlCountry", null);
    await unit("nairobi", "ke/nairobi", "Nairobi", "lvlCounty", "country");
    await unit("kisumu", "ke/kisumu", "Kisumu", "lvlCounty", "country");
    await unit("westlands", "ke/nairobi/westlands", "Westlands", "lvlWard", "nairobi");
    await unit("parklands", "ke/nairobi/parklands", "Parklands", "lvlWard", "nairobi");
    // Provenance and verification are not columns: they live in the source schema and point at the row.
    const publisher = await save("PublisherEntity", "publisher", { kindId: ids.ke, code: "survey-office", name: "Survey Office", createdAt: new Date(), updatedAt: new Date(), version: 1 });
    void publisher;
    await save("DocumentEntity", "survey", { publisherId: ids.publisher, kindId: ids.ke, title: "Test survey", licence: "CC-BY-4.0", citation: "Survey 2020", createdAt: new Date(), updatedAt: new Date(), version: 1 });
    await save("MethodEntity", "method", { kind: "curated", name: "Hand curated", createdAt: new Date(), updatedAt: new Date(), version: 1 });
    await save("CaptureEntity", "capture", { documentId: ids.survey, retrievedAt: new Date("2025-01-14T10:00:00Z"), createdAt: new Date(), updatedAt: new Date(), version: 1 });
    const boundary = async (key: string, unitKey: string, state: string) => {
      await save("GeoBoundaryVersionEntity", key, fact({ unitId: ids[unitKey], versionNumber: 1, geometry: polygon, referenceYear: 2020 }));
      await save("VerificationEntity", `${key}:verification`, { targetKind: "geography.boundaries", targetId: ids[key], state, isCurrent: true, createdAt: new Date(), updatedAt: new Date(), version: 1 });
      if (state === "verified") {
        await save("AttributionEntity", `${key}:attribution`, { documentId: ids.survey, captureId: ids.capture, methodId: ids.method, targetKind: "geography.boundaries", targetId: ids[key], relation: "supports", createdAt: new Date(), updatedAt: new Date(), version: 1 });
      }
    };
    await boundary("bCountry", "country", "verified");
    await boundary("bNairobi", "nairobi", "verified");
    await boundary("bKisumu", "kisumu", "verified");
    await boundary("bWestlands", "westlands", "verified");
    await boundary("bParklands", "parklands", "unverified");
    await save("GeoUnitNameVersionEntity", "nameOld", fact({ unitId: ids.nairobi, name: "Nyrobi", validTo: "1963-12-12", isCurrent: false }));
    await save("GeoUnitChangeEntity", "change", fact({ sourceUnitId: ids.kisumu, targetUnitId: ids.nairobi, kind: "continued_as" }));

    // Governance linked to Nairobi: an institution, its office and a current and a former holder.
    await save("InstitutionEntity", "county", fact({ jurisdictionId: ids.ke, code: "ke/nairobi/county-government", name: "Nairobi County Government", typeId: ids.ke, geoUnitId: ids.nairobi }));
    await save("OfficeEntity", "governor", fact({ institutionId: ids.county, code: "ke/nairobi/governor", name: "Governor", isSingleton: true }));
    await save("PersonEntity", "person", fact({ code: "example/person", displayName: "Example Person", lifeStatus: "alive" }));
    await save("OfficeHolderEntity", "holderNow", fact({ officeId: ids.governor, personId: ids.person, status: "substantive" }));
    await save("OfficeHolderEntity", "holderPast", fact({ officeId: ids.governor, personId: ids.person, status: "substantive", isCurrent: false, departureReason: "term_ended" }));

    // Finance: a budget with its currency.
    await save("BudgetaryUnitEntity", "treasury", fact({ jurisdictionId: ids.ke, code: "ke/treasury", name: "Treasury", levelId: ids.ke }));
    await save("BudgetEntity", "budget", fact({ unitId: ids.treasury, fiscalYearId: ids.ke, kind: "original", approvedAmount: "1500000.5000", currencyCode: "KES" }));

    // People: one public office contact, one private number, a public and a restricted handle.
    await save("PersonContactEntity", "contactPublic", fact({ personId: ids.person, kind: "email", value: "governor@nairobi.example", exposure: "public" }));
    await save("PersonContactEntity", "contactPrivate", fact({ personId: ids.person, kind: "phone", value: "+000 private", exposure: "private" }));
    await save("PersonHandleEntity", "handlePublic", fact({ personId: ids.person, platformId: ids.ke, handle: "@governor", isVerified: true, exposure: "public" }));
    await save("PersonHandleEntity", "handleRestricted", fact({ personId: ids.person, platformId: ids.ke, handle: "@family", isVerified: false, exposure: "restricted" }));

    // Files: a public portrait and a restricted scan, each with a version and an attachment.
    const row = { createdAt: new Date(), updatedAt: new Date(), version: 1 };
    await save("StoreEntity", "store", { ...row, code: "primary", kind: "object_store", configurationName: "primary-bucket", tier: "hot", isActive: true });
    await save("FolderEntity", "folder", { ...row, name: "portraits", path: "portraits", depth: 0, visibility: "public" });
    const file = async (key: string, name: string, visibility: string, hash: string) => {
      await save("StoredObjectEntity", `${key}:object`, { ...row, storeId: ids.store, contentHash: hash.repeat(64).slice(0, 64), sizeBytes: 2048, objectKey: `sha256/${hash}/${key}`, scanStatus: "clean" });
      await save("FileEntity", key, { ...row, folderId: ids.folder, name, status: "active", visibility, isLegalHold: false });
      await save("FileVersionEntity", `${key}:version`, { ...row, fileId: ids[key], objectId: ids[`${key}:object`], versionNumber: 1 });
      await save("FileAttachmentEntity", `${key}:attachment`, { ...row, fileId: ids[key], targetKind: "person.individuals", targetId: ids.person, role: key === "portrait" ? "portrait" : "scan", position: 0 });
    };
    await file("portrait", "portrait.jpg", "public", "a");
    await file("secretScan", "scan.pdf", "restricted", "b");

    await admin.query(`DO $$ BEGIN IF EXISTS (SELECT FROM pg_roles WHERE rolname = '${READER}') THEN DROP OWNED BY ${READER}; DROP ROLE ${READER}; END IF; END $$`);
    await admin.query(`CREATE ROLE ${READER} LOGIN PASSWORD 'reader'`);
    await grantReadOnly(admin, READER);
    const url = new URL(dbUrl);
    url.username = READER;
    url.password = "reader";
    reader = new DataSource({ type: "postgres", url: url.toString(), entities });
    await reader.initialize();
  });

  afterAll(async () => {
    await reader?.destroy();
    await admin?.query(`DROP OWNED BY ${READER}`);
    await admin?.query(`DROP ROLE IF EXISTS ${READER}`);
    await admin?.destroy();
  });

  describe("lists", () => {
    it("return current records only by default", async () => {
      const result = await new FindLegalInstrumentsUseCase(reader).execute({} as never);
      expect((result as never as { instruments: Array<{ code: string }> }).instruments.map((item) => item.code)).toEqual(["ke/constitution-2010"]);
    });

    it("include superseded versions when asked", async () => {
      const result = await new FindLegalInstrumentsUseCase(reader).execute({ includeHistory: true } as never);
      expect((result as never as { instruments: unknown[] }).instruments).toHaveLength(2);
    });

    it("search text case-insensitively and filter by column", async () => {
      const found = await new FindLegalInstrumentsUseCase(reader).execute({ q: "CONSTITUTION", includeHistory: true, status: "superseded" } as never);
      expect((found as never as { instruments: Array<{ code: string }> }).instruments.map((item) => item.code)).toEqual(["ke/constitution-1963"]);
    });

    it("bound paging so a huge limit or a zero page cannot run away", async () => {
      const result = (await new FindLegalInstrumentsUseCase(reader).execute({ page: 0, limit: 99999 } as never)) as never as { meta: { page: number; limit: number; total: number } };
      expect(result.meta).toMatchObject({ page: 1, limit: 200, total: 1 });
    });

    it("keep money and currency together", async () => {
      const result = (await new FindBudgetsUseCase(reader).execute({ unitId: ids.treasury } as never)) as never as { budgets: Array<{ approvedAmount: string; currencyCode: string }> };
      expect(result.budgets).toHaveLength(1);
      expect(result.budgets[0]).toMatchObject({ currencyCode: "KES" });
      expect(Number(result.budgets[0]?.approvedAmount)).toBe(1500000.5);
    });
  });

  describe("details", () => {
    it("return a superseded version by id", async () => {
      const result = (await new GetLegalInstrumentByIdUseCase(reader).execute({ instrumentId: ids.instrOld })) as never as { instrument: { status: string } };
      expect(result.instrument.status).toBe("superseded");
    });

    it("answer 404 for an unknown id", async () => {
      await expect(new GetLegalInstrumentByIdUseCase(reader).execute({ instrumentId: "99999999-9999-4999-8999-999999999999" })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("geography", () => {
    it("searches by name within a jurisdiction and current units only", async () => {
      const found = (await new SearchGeographyUseCase(reader).execute({ q: "nai", country: "KE" } as never)) as never as Page<"results">;
      expect(found.results.map((item) => item.code)).toEqual(["ke/nairobi", "ke/nairobi/parklands", "ke/nairobi/westlands"]); // matches name or code, so the county and its wards
      const none = (await new SearchGeographyUseCase(reader).execute({ q: "nai", country: "example-realm" } as never)) as never as Page<"results">;
      expect(none.results).toEqual([]);
    });

    it("reads boundary source, licence and verified state from the source schema", async () => {
      const entity = (await new GetGeographyEntityUseCase(reader).execute({ entityId: ids.nairobi })) as never as Record<string, unknown>;
      expect(entity).toMatchObject({ boundaryVerified: true, boundarySource: "Test survey", boundaryLicense: "CC-BY-4.0", boundarySourceReference: "Survey 2020", boundaryYear: 2020 });
      const unverified = (await new GetGeographyEntityUseCase(reader).execute({ entityId: ids.parklands })) as never as Record<string, unknown>;
      expect(unverified).toMatchObject({ boundaryVerified: false });
    });

    it("serves only verified boundaries", async () => {
      const verified = await new GetGeographyBoundaryUseCase(reader).execute({ entityId: ids.nairobi });
      expect(JSON.parse(verified.geojson).geometry.type).toBe("Polygon");
      await expect(new GetGeographyBoundaryUseCase(reader).execute({ entityId: ids.parklands })).rejects.toBeInstanceOf(NotFoundException);
      const children = await new GetChildBoundariesUseCase(reader).execute({ entityId: ids.nairobi });
      expect(JSON.parse(children.geojson).features.map((feature: { properties: { code: string } }) => feature.properties.code)).toEqual(["ke/nairobi/westlands"]);
    });

    it("returns ancestors root first and current children", async () => {
      const result = (await new GetGeographyHierarchyUseCase(reader).execute({ entityId: ids.westlands })) as never as { ancestors: Array<{ code: string }>; children: unknown[] };
      expect(result.ancestors.map((item) => item.code)).toEqual(["ke", "ke/nairobi"]);
      const parent = (await new GetGeographyHierarchyUseCase(reader).execute({ entityId: ids.nairobi })) as never as { children: Array<{ code: string }> };
      expect(parent.children.map((item) => item.code)).toEqual(["ke/nairobi/parklands", "ke/nairobi/westlands"]);
    });

    it("gives map context from verified boundaries only, excluding the entity itself", async () => {
      const result = (await new GetGeographyMapContextUseCase(reader).execute({ entityId: ids.westlands })) as never as { parentGeojson: string; siblingsGeojson: string };
      expect(JSON.parse(result.parentGeojson).properties.code).toBe("ke/nairobi");
      expect(JSON.parse(result.siblingsGeojson).features).toEqual([]); // the only sibling has an unverified boundary
      const county = (await new GetGeographyMapContextUseCase(reader).execute({ entityId: ids.nairobi })) as never as { siblingsGeojson: string };
      expect(JSON.parse(county.siblingsGeojson).features.map((feature: { properties: { code: string } }) => feature.properties.code)).toEqual(["ke/kisumu"]);
    });

    it("lists verified boundaries by country and level", async () => {
      const result = await new ListBoundariesByLevelUseCase(reader).execute({ country: "KE", level: "County" } as never);
      const codes = JSON.parse(result.geojson).features.map((feature: { properties: { code: string } }) => feature.properties.code);
      expect(codes).toEqual(["ke/kisumu", "ke/nairobi"]);
    });

    it("returns historical names and lineage", async () => {
      const result = (await new GetGeographyHistoryUseCase(reader).execute({ entityId: ids.nairobi })) as never as { names: Array<{ name: string }>; changes: Array<{ kind: string }> };
      expect(result.names.map((item) => item.name)).toEqual(["Nyrobi"]);
      expect(result.changes.map((item) => item.kind)).toEqual(["continued_as"]);
    });

    it("returns the institution, office and current holders linked to a place", async () => {
      const result = (await new GetGeographyGovernanceUseCase(reader).execute({ entityId: ids.nairobi })) as never as {
        institutions: Array<{ code: string }>;
        offices: Array<{ code: string }>;
        holders: Array<{ id: string }>;
      };
      expect(result.institutions.map((item) => item.code)).toEqual(["ke/nairobi/county-government"]);
      expect(result.offices.map((item) => item.code)).toEqual(["ke/nairobi/governor"]);
      expect(result.holders.map((item) => item.id)).toEqual([ids.holderNow]);
    });

    it("answers 404 for an unknown entity", async () => {
      await expect(new GetGeographyHierarchyUseCase(reader).execute({ entityId: "99999999-9999-4999-8999-999999999999" })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("people", () => {
    it("serves public contacts and handles only", async () => {
      const contacts = (await new FindPersonContactsUseCase(reader).execute({ personId: ids.person } as never)) as never as Page<"contacts">;
      expect(contacts.contacts.map((item) => item.value)).toEqual(["governor@nairobi.example"]);
      const handles = (await new FindPersonHandlesUseCase(reader).execute({ personId: ids.person } as never)) as never as Page<"handles">;
      expect(handles.handles.map((item) => item.handle)).toEqual(["@governor"]);
    });

    it("cannot be asked for private values by changing the query", async () => {
      const contacts = (await new FindPersonContactsUseCase(reader).execute({ personId: ids.person, exposure: "private" } as never)) as never as Page<"contacts">;
      expect(contacts.contacts.map((item) => item.exposure)).toEqual(["public"]);
      await expect(new GetPersonContactByIdUseCase(reader).execute({ contactId: ids.contactPrivate })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("files and media", () => {
    it("lists public active files only and hides restricted ones by id", async () => {
      const files = (await new FindFilesUseCase(reader).execute({} as never)) as never as Page<"files">;
      expect(files.files.map((item) => item.name)).toEqual(["portrait.jpg"]);
      await expect(new GetFileByIdUseCase(reader).execute({ fileId: ids.secretScan })).rejects.toBeInstanceOf(NotFoundException);
    });

    it("shows versions and attachments of public files only", async () => {
      const versions = (await new FindFileVersionsUseCase(reader).execute({} as never)) as never as Page<"versions">;
      expect(versions.versions.map((item) => item.fileId)).toEqual([ids.portrait]);
      const attachments = (await new FindFileAttachmentsUseCase(reader).execute({ targetKind: "person.individuals", targetId: ids.person } as never)) as never as Page<"attachments">;
      expect(attachments.attachments.map((item) => item.role)).toEqual(["portrait"]);
    });

    it("never exposes object keys, hashes or store details in file metadata", async () => {
      const everything = JSON.stringify([
        await new FindFilesUseCase(reader).execute({} as never),
        await new FindFileVersionsUseCase(reader).execute({} as never),
        await new FindFileAttachmentsUseCase(reader).execute({} as never),
      ]);
      expect(everything).not.toMatch(/objectKey|sha256\/|contentHash|configurationName|primary-bucket/);
    });
  });

  it("never writes: the read-only role is refused", async () => {
    await expect(reader.query(`UPDATE legal.instruments SET title = 'x'`)).rejects.toThrow(/permission denied/);
  });
});
