import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetEntryDto } from "#/modules/finance/schema/dto/budget-entry.dto.ts";
import { budgetEntryExample } from "@test/modules/finance/schema/dto/examples/budget-entry.dto.example.ts";

/** Managed by Dryv: BudgetEntryDto enforces exactly what the BudgetEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...budgetEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
