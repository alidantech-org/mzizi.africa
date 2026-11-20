/** Opt-in read-only acceptance against the existing development database, never a reset or seed. */
import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { BootstrapDto } from "#/modules/explorer/schema/dto/bootstrap.dto";
import { ContextDto } from "#/modules/explorer/schema/dto/context.dto";
import { OverviewDto } from "#/modules/explorer/schema/dto/overview.dto";
import { PlacesDto } from "#/modules/explorer/schema/dto/places.dto";
import { ResolutionDto } from "#/modules/explorer/schema/dto/resolution.dto";
import type { CoordinatesInputDto } from "#/modules/explorer/schema/dto/coordinates-input.dto";
import type { DtoConstructor } from "#/modules/explorer/features/explorer/reads/parse.ts";
const origin = process.env.MZIZI_EXPLORER_TEST_URL;
async function read<T extends object>(
  path: string,
  dto: DtoConstructor<T>,
  body?: CoordinatesInputDto,
): Promise<T> {
  const response = await fetch(
    `${origin}${path}`,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : undefined,
  );
  expect(response.status).toBe(200);
  const raw: unknown = await response.json();
  const parsed = plainToInstance(dto, raw);
  expect(await validate(parsed, { whitelist: true, forbidNonWhitelisted: true })).toEqual([]);
  return parsed;
}
describe.skipIf(!origin)("connected explorer acceptance", () => {
  it("exposes countries and registered copy languages without fake flags", async () => {
    const result = await read("/v1/explorer/setup", BootstrapDto);
    expect(result.countries.some((country) => country.code === "KE" && country.rootFeatureId)).toBe(
      true,
    );
    expect(result.languages.some((language) => language.code === "sw")).toBe(true);
    expect(result.countries.every((country) => country.flagUrl === null)).toBe(true);
  });
  it("resolves Kenya and Westlands from authoritative registered paths", async () => {
    const root = await read("/v1/explorer/overview?countryCode=KE", OverviewDto);
    expect(root.context.place.canonicalPath).toBe("/ke");
    expect(root.children.total).toBe(47);
    const place = await read(
      "/v1/explorer/context?countryCode=KE&path=nairobi%2Fwestlands",
      ContextDto,
    );
    expect(place.chain.map((item) => item.canonicalPath)).toEqual([
      "/ke",
      "/ke/nairobi",
      "/ke/nairobi/westlands",
    ]);
  });
  it("does not infer a country or accept mismatched identities", async () => {
    expect((await fetch(`${origin}/v1/explorer/context`)).status).toBe(400);
    const place = await read(
      "/v1/explorer/context?countryCode=KE&path=nairobi%2Fwestlands",
      ContextDto,
    );
    expect(
      (
        await fetch(
          `${origin}/v1/explorer/context?countryCode=ZA&featureId=${place.place.featureId}`,
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await fetch(
          `${origin}/v1/explorer/context?countryCode=KE&featureId=${place.place.featureId}&path=mombasa`,
        )
      ).status,
    ).toBe(400);
    expect(
      (await fetch(`${origin}/v1/explorer/context?countryCode=KE&path=unknown-place`)).status,
    ).toBe(404);
  });
  it("keeps pagination stable and search within its country", async () => {
    const first = await read("/v1/explorer/children?countryCode=KE&limit=2&page=1", PlacesDto);
    const again = await read("/v1/explorer/children?countryCode=KE&limit=2&page=1", PlacesDto);
    const second = await read("/v1/explorer/children?countryCode=KE&limit=2&page=2", PlacesDto);
    expect(first).toEqual(again);
    expect(first.places.map((item) => item.featureId)).not.toEqual(
      second.places.map((item) => item.featureId),
    );
    const found = await read("/v1/explorer/search?countryCode=KE&query=Kisumu", PlacesDto);
    expect(found.total).toBeGreaterThan(0);
    expect(found.places.every((item) => item.countryCode === "KE")).toBe(true);
    expect((await fetch(`${origin}/v1/explorer/children?countryCode=KE&page=0`)).status).toBe(400);
    expect((await fetch(`${origin}/v1/explorer/children?countryCode=KE&page=1e100`)).status).toBe(
      400,
    );
  });
  it("supports the smaller South Africa routing proof without defaulting to Kenya", async () => {
    const result = await read("/v1/explorer/context?countryCode=ZA", ContextDto);
    expect(result.place.canonicalPath).toBe("/za");
    expect(result.country.code).toBe("ZA");
    expect(result.gaps.length).toBeGreaterThan(0);
  });
  it("resolves coordinates without writing a place preference or publishing coordinates", async () => {
    const result = await read("/v1/explorer/resolve", ResolutionDto, {
      latitude: -1.29,
      longitude: 36.82,
      accuracyMeters: 50,
      countryCode: "KE",
    });
    expect(["matched", "ambiguous", "unresolved"]).toContain(result.status);
    expect(result.candidates.every((item) => item.canonicalPath.startsWith("/ke"))).toBe(true);
    expect(result.gaps.length).toBeGreaterThan(0);
  });
});
