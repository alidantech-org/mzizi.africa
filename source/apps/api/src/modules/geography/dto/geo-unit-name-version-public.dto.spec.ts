import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitNameVersionPublicDto } from "#/modules/geography/dto/geo-unit-name-version-public.dto.ts";
import { geoUnitNameVersionPublicExample } from "#/modules/geography/dto/geo-unit-name-version-public.dto.example.ts";

/** Managed by Dryv: GeoUnitNameVersionPublicDto enforces exactly what the GeoUnitNameVersionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitNameVersionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitNameVersionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitNameVersionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitNameVersionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geoUnitNameVersionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});