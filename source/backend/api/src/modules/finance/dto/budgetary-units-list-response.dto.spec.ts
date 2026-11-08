import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetaryUnitsListResponseDto } from "#/modules/finance/dto/budgetary-units-list-response.dto.ts";
import { budgetaryUnitsListResponseExample } from "#/modules/finance/dto/budgetary-units-list-response.dto.example.ts";

/** Managed by Dryv: BudgetaryUnitsListResponseDto enforces exactly what the BudgetaryUnitsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetaryUnitsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetaryUnitsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetaryUnitsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetaryUnitsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetaryUnitsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});