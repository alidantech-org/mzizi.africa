import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetVersionsDto } from "#/modules/finance/schema/dto/budget-versions.dto.ts";
import { budgetVersionsExample } from "@test/modules/finance/schema/dto/examples/budget-versions.dto.example.ts";

/** Managed by Dryv: BudgetVersionsDto enforces exactly what the BudgetVersions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetVersionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetVersionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetVersionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetVersionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetVersionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
