import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AmenityPublicDto } from "#/modules/services/dto/amenity-public.dto.ts";
import { amenityPublicExample } from "#/modules/services/dto/amenity-public.dto.example.ts";

/** Managed by Dryv: AmenityPublicDto enforces exactly what the AmenityPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AmenityPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = amenityPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AmenityPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(amenityPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...amenityPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});