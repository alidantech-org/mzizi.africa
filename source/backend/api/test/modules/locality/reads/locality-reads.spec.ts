/**
 * The locality reads against a real database filled by `bun run dev:data`. Set TEST_DATABASE_URL to the dev database
 * (for example postgres://…/mzizi_ui) to run it; without it the suite is skipped. Hand-written.
 */
import "reflect-metadata";

import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { evidenceDetail, evidenceFor } from "#/modules/locality/features/places/reads/evidence.ts";
import { languageChoices, servedLanguage } from "#/modules/locality/features/places/reads/language.ts";
import { officialsFor } from "#/modules/locality/features/places/reads/officials.ts";
import { chainOf, featureAt, searchPlaces } from "#/modules/locality/features/places/reads/places.ts";
import { buildProfile } from "#/modules/locality/features/places/reads/profile.ts";
import { procurementFor } from "#/modules/locality/features/places/reads/procurement.ts";
import { browseSources } from "#/modules/locality/features/places/reads/sources.ts";

const url = process.env.TEST_DATABASE_URL;
// Inside the Karura ward of Westlands constituency, Nairobi.
const KARURA = { latitude: -1.2676, longitude: 36.8108 };

describe.skipIf(url === undefined)("locality reads (dev database)", () => {
  let db: DataSource;
  beforeAll(async () => {
    db = new DataSource({ type: "postgres", url });
    await db.initialize();
  });
  afterAll(async () => {
    await db.destroy();
  });

  it("finds the smallest unit at a position and the chain above it, widest first", async () => {
    const id = await featureAt(db, KARURA.latitude, KARURA.longitude);
    expect(id).not.toBeNull();
    const chain = await chainOf(db, id as string, "en");
    expect(chain.map((unit) => unit.name)).toEqual(["Republic of Kenya", "Nairobi", "Westlands", "Karura"]);
    expect(chain.map((unit) => unit.depth)).toEqual([0, 1, 2, 3]);
  });

  it("returns null for a position outside every recorded outline", async () => {
    expect(await featureAt(db, 48.85, 2.35)).toBeNull();
  });

  it("serves names and labels in the requested language and falls back to English", async () => {
    const id = (await featureAt(db, KARURA.latitude, KARURA.longitude)) as string;
    const swahili = await chainOf(db, id, "sw");
    expect(swahili[0]?.name).toBe("Jamhuri ya Kenya");
    expect(await servedLanguage(db, "sw")).toBe("sw");
    expect(await servedLanguage(db, "xx")).toBe("en");
    expect((await languageChoices(db)).map((language) => language.code)).toContain("sw");
  });

  it("lists the officials of the chain's units with their office titles and evidence", async () => {
    const id = (await featureAt(db, KARURA.latitude, KARURA.longitude)) as string;
    const unitIds = (await chainOf(db, id, "en")).map((unit) => unit.featureId).reverse();
    const officials = await officialsFor(db, unitIds, "sw", undefined);
    expect(officials.map((official) => official.officeTitle.split(",")[0])).toEqual([
      "Mwakilishi wa Wadi",
      "Mbunge",
      "Gavana",
    ]);
    expect(officials.every((official) => official.evidence.length > 0)).toBe(true);
    const detail = await evidenceDetail(db, officials[0]?.evidence[0]?.citationId as string);
    expect(detail?.evidence.locator).toMatch(/^Line \d+ of the source file$/);
  });

  it("chooses office holders by date", async () => {
    const id = (await featureAt(db, KARURA.latitude, KARURA.longitude)) as string;
    const unitIds = (await chainOf(db, id, "en")).map((unit) => unit.featureId);
    expect(await officialsFor(db, unitIds, "en", "2020-01-01")).toEqual([]);
  });

  it("summarises procurement and builds a whole profile", async () => {
    const id = (await featureAt(db, KARURA.latitude, KARURA.longitude)) as string;
    const unitIds = (await chainOf(db, id, "en")).map((unit) => unit.featureId);
    const summary = await procurementFor(db, unitIds);
    expect(summary.count).toBeGreaterThan(0);
    expect(summary.currency).toBe("KES");
    const profile = await buildProfile(db, id, "en", undefined);
    expect(profile?.place.name).toBe("Karura");
    expect(profile?.languageServed).toBe("en");
    expect(profile?.gaps.length).toBeGreaterThan(0);
    expect(await buildProfile(db, "00000000-0000-4000-8000-000000000000", "en", undefined)).toBeNull();
  });

  it("searches places by name, exact matches first, and lists sources", async () => {
    const places = await searchPlaces(db, "westlands", "en", 5);
    expect(places[0]?.name).toBe("Westlands");
    expect((await browseSources(db, undefined, 3)).length).toBe(3);
    expect(await evidenceFor(db, "governance.holders", [])).toEqual(new Map());
  });
});
