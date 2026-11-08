import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceDto } from "#/modules/place/dto/place.dto.ts";
import { placeExample } from "#/modules/place/dto/place.dto.example.ts";

/** Managed by Dryv: PlaceDto enforces exactly what the Place contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...placeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});