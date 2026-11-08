import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetDto } from "#/modules/finance/dto/budget.dto.ts";
import { budgetExample } from "#/modules/finance/dto/budget.dto.example.ts";

/** Managed by Dryv: BudgetDto enforces exactly what the Budget contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});