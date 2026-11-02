import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionDto } from "#/modules/statistics/dto/dimension.dto.ts";
import { dimensionExample } from "#/modules/statistics/dto/dimension.dto.example.ts";

/** Managed by Dryv: DimensionDto enforces exactly what the Dimension contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});