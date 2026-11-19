import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetListDto } from "#/modules/ledger/schema/dto/budget-list.dto.ts";
import { budgetListExample } from "@test/modules/ledger/schema/dto/examples/budget-list.dto.example.ts";

/** Managed by Dryv: BudgetListDto enforces exactly what the BudgetList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
