import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComparisonADto } from "#/modules/insights/schema/dto/comparison-a.dto.ts";
import { comparisonAExample } from "@test/modules/insights/schema/dto/examples/comparison-a.dto.example.ts";

/** Managed by Dryv: ComparisonADto enforces exactly what the ComparisonA contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComparisonADto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = comparisonAExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComparisonADto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(comparisonAExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...comparisonAExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
