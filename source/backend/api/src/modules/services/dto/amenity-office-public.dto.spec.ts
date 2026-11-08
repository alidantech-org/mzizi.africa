import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityOfficePublicDto } from "#/modules/services/dto/amenity-office-public.dto.ts";
import { amenityOfficePublicExample } from "#/modules/services/dto/amenity-office-public.dto.example.ts";

/** Managed by Dryv: AmenityOfficePublicDto enforces exactly what the AmenityOfficePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityOfficePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityOfficePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityOfficePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityOfficePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityOfficePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});