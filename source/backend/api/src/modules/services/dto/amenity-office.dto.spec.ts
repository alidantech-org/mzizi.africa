import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityOfficeDto } from "#/modules/services/dto/amenity-office.dto.ts";
import { amenityOfficeExample } from "#/modules/services/dto/amenity-office.dto.example.ts";

/** Managed by Dryv: AmenityOfficeDto enforces exactly what the AmenityOffice contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityOfficeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityOfficeExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityOfficeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityOfficeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityOfficeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});