import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityListQueryDto } from "#/modules/services/dto/amenity-list-query.dto.ts";
import { amenityListQueryExample } from "#/modules/services/dto/amenity-list-query.dto.example.ts";

/** Managed by Dryv: AmenityListQueryDto enforces exactly what the AmenityListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});