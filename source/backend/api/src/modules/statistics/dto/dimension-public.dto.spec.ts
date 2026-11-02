import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionPublicDto } from "#/modules/statistics/dto/dimension-public.dto.ts";
import { dimensionPublicExample } from "#/modules/statistics/dto/dimension-public.dto.example.ts";

/** Managed by Dryv: DimensionPublicDto enforces exactly what the DimensionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});