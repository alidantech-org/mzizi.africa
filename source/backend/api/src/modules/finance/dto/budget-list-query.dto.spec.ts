import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetListQueryDto } from "#/modules/finance/dto/budget-list-query.dto.ts";
import { budgetListQueryExample } from "#/modules/finance/dto/budget-list-query.dto.example.ts";

/** Managed by Dryv: BudgetListQueryDto enforces exactly what the BudgetListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});