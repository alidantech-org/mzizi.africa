import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityOfficesListResponseDto } from "#/modules/services/dto/amenity-offices-list-response.dto.ts";
import { amenityOfficesListResponseExample } from "#/modules/services/dto/amenity-offices-list-response.dto.example.ts";

/** Managed by Dryv: AmenityOfficesListResponseDto enforces exactly what the AmenityOfficesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityOfficesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityOfficesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityOfficesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityOfficesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityOfficesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});