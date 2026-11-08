import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityResponseDto } from "#/modules/services/dto/amenity-response.dto.ts";
import { amenityResponseExample } from "#/modules/services/dto/amenity-response.dto.example.ts";

/** Managed by Dryv: AmenityResponseDto enforces exactly what the AmenityResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});