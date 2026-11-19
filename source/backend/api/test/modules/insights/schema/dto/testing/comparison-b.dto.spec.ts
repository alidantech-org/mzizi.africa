import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComparisonBDto } from "#/modules/insights/schema/dto/comparison-b.dto.ts";
import { comparisonBExample } from "@test/modules/insights/schema/dto/examples/comparison-b.dto.example.ts";

/** Managed by Dryv: ComparisonBDto enforces exactly what the ComparisonB contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComparisonBDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = comparisonBExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComparisonBDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(comparisonBExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...comparisonBExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
