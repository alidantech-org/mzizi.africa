import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitChangePublicDto } from "#/modules/geography/dto/geo-unit-change-public.dto.ts";
import { geoUnitChangePublicExample } from "#/modules/geography/dto/geo-unit-change-public.dto.example.ts";

/** Managed by Dryv: GeoUnitChangePublicDto enforces exactly what the GeoUnitChangePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitChangePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitChangePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitChangePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitChangePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geoUnitChangePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});