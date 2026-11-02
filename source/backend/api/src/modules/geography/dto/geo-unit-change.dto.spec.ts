import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitChangeDto } from "#/modules/geography/dto/geo-unit-change.dto.ts";
import { geoUnitChangeExample } from "#/modules/geography/dto/geo-unit-change.dto.example.ts";

/** Managed by Dryv: GeoUnitChangeDto enforces exactly what the GeoUnitChange contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitChangeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitChangeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitChangeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitChangeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...geoUnitChangeExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
