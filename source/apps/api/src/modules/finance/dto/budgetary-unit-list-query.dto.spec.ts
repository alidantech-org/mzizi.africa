import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetaryUnitListQueryDto } from "#/modules/finance/dto/budgetary-unit-list-query.dto.ts";
import { budgetaryUnitListQueryExample } from "#/modules/finance/dto/budgetary-unit-list-query.dto.example.ts";

/** Managed by Dryv: BudgetaryUnitListQueryDto enforces exactly what the BudgetaryUnitListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetaryUnitListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetaryUnitListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetaryUnitListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetaryUnitListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetaryUnitListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});