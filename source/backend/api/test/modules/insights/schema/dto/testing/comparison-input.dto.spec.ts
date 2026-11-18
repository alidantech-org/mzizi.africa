import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ComparisonInputDto } from "#/modules/insights/schema/dto/comparison-input.dto.ts";
import { comparisonInputExample } from "@test/modules/insights/schema/dto/examples/comparison-input.dto.example.ts";

/** Managed by Dryv: ComparisonInputDto enforces exactly what the ComparisonInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ComparisonInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = comparisonInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ComparisonInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(comparisonInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...comparisonInputExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
