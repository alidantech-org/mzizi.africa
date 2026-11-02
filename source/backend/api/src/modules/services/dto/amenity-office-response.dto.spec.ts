import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityOfficeResponseDto } from "#/modules/services/dto/amenity-office-response.dto.ts";
import { amenityOfficeResponseExample } from "#/modules/services/dto/amenity-office-response.dto.example.ts";

/** Managed by Dryv: AmenityOfficeResponseDto enforces exactly what the AmenityOfficeResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityOfficeResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityOfficeResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityOfficeResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityOfficeResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityOfficeResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});