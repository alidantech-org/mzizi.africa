import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitPublicDto } from "#/modules/geography/dto/geo-unit-public.dto.ts";
import { geoUnitPublicExample } from "#/modules/geography/dto/geo-unit-public.dto.example.ts";

/** Managed by Dryv: GeoUnitPublicDto enforces exactly what the GeoUnitPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitPublicExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({ ...geoUnitPublicExample.valid(), unexpectedField: 1 }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
