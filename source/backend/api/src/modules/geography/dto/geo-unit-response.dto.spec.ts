import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeoUnitResponseDto } from "#/modules/geography/dto/geo-unit-response.dto.ts";
import { geoUnitResponseExample } from "#/modules/geography/dto/geo-unit-response.dto.example.ts";

/** Managed by Dryv: GeoUnitResponseDto enforces exactly what the GeoUnitResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeoUnitResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geoUnitResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeoUnitResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geoUnitResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geoUnitResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});