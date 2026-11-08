import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetaryUnitPublicDto } from "#/modules/finance/dto/budgetary-unit-public.dto.ts";
import { budgetaryUnitPublicExample } from "#/modules/finance/dto/budgetary-unit-public.dto.example.ts";

/** Managed by Dryv: BudgetaryUnitPublicDto enforces exactly what the BudgetaryUnitPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetaryUnitPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetaryUnitPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetaryUnitPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetaryUnitPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetaryUnitPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});