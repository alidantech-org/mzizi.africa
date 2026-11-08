import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetsListResponseDto } from "#/modules/finance/dto/budgets-list-response.dto.ts";
import { budgetsListResponseExample } from "#/modules/finance/dto/budgets-list-response.dto.example.ts";

/** Managed by Dryv: BudgetsListResponseDto enforces exactly what the BudgetsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});