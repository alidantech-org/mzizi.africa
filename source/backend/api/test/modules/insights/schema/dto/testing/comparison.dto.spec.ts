import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComparisonDto } from "#/modules/insights/schema/dto/comparison.dto.ts";
import { comparisonExample } from "@test/modules/insights/schema/dto/examples/comparison.dto.example.ts";

/** Managed by Dryv: ComparisonDto enforces exactly what the Comparison contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComparisonDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = comparisonExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComparisonDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(comparisonExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...comparisonExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
