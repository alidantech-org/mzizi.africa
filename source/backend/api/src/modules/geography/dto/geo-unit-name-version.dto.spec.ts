import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitNameVersionDto } from "#/modules/geography/dto/geo-unit-name-version.dto.ts";
import { geoUnitNameVersionExample } from "#/modules/geography/dto/geo-unit-name-version.dto.example.ts";

/** Managed by Dryv: GeoUnitNameVersionDto enforces exactly what the GeoUnitNameVersion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitNameVersionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitNameVersionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitNameVersionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitNameVersionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...geoUnitNameVersionExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
