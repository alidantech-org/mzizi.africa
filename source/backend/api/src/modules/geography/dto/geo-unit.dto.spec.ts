import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitDto } from "#/modules/geography/dto/geo-unit.dto.ts";
import { geoUnitExample } from "#/modules/geography/dto/geo-unit.dto.example.ts";

/** Managed by Dryv: GeoUnitDto enforces exactly what the GeoUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...geoUnitExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
