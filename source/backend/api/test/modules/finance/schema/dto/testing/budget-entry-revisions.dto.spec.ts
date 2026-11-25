import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetEntryRevisionsDto } from "#/modules/finance/schema/dto/budget-entry-revisions.dto.ts";
import { budgetEntryRevisionsExample } from "@test/modules/finance/schema/dto/examples/budget-entry-revisions.dto.example.ts";

/** Managed by Dryv: BudgetEntryRevisionsDto enforces exactly what the BudgetEntryRevisions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetEntryRevisionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetEntryRevisionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetEntryRevisionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetEntryRevisionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...budgetEntryRevisionsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
