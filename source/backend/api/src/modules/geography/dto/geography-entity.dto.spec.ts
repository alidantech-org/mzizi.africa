import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyEntityDto } from "#/modules/geography/dto/geography-entity.dto.ts";
import { geographyEntityExample } from "#/modules/geography/dto/geography-entity.dto.example.ts";

/** Managed by Dryv: GeographyEntityDto enforces exactly what the GeographyEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyEntityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});