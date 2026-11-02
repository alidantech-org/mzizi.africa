import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityOfficeListQueryDto } from "#/modules/services/dto/amenity-office-list-query.dto.ts";
import { amenityOfficeListQueryExample } from "#/modules/services/dto/amenity-office-list-query.dto.example.ts";

/** Managed by Dryv: AmenityOfficeListQueryDto enforces exactly what the AmenityOfficeListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityOfficeListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityOfficeListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityOfficeListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityOfficeListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityOfficeListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});