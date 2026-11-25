import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DimensionsDto } from "#/modules/statistics/schema/dto/dimensions.dto.ts";
import { dimensionsExample } from "@test/modules/statistics/schema/dto/examples/dimensions.dto.example.ts";

/** Managed by Dryv: DimensionsDto enforces exactly what the Dimensions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DimensionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dimensionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DimensionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dimensionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dimensionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
