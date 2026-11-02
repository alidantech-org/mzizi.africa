import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetaryUnitDto } from "#/modules/finance/dto/budgetary-unit.dto.ts";
import { budgetaryUnitExample } from "#/modules/finance/dto/budgetary-unit.dto.example.ts";

/** Managed by Dryv: BudgetaryUnitDto enforces exactly what the BudgetaryUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetaryUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetaryUnitExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetaryUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetaryUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetaryUnitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});