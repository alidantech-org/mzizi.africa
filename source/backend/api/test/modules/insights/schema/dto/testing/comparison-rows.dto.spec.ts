import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComparisonRowsDto } from "#/modules/insights/schema/dto/comparison-rows.dto.ts";
import { comparisonRowsExample } from "@test/modules/insights/schema/dto/examples/comparison-rows.dto.example.ts";

/** Managed by Dryv: ComparisonRowsDto enforces exactly what the ComparisonRows contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComparisonRowsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = comparisonRowsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComparisonRowsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(comparisonRowsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...comparisonRowsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
