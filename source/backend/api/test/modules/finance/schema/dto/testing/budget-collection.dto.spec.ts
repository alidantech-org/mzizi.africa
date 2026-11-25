import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BudgetCollectionDto } from "#/modules/finance/schema/dto/budget-collection.dto.ts";
import { budgetCollectionExample } from "@test/modules/finance/schema/dto/examples/budget-collection.dto.example.ts";

/** Managed by Dryv: BudgetCollectionDto enforces exactly what the BudgetCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BudgetCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = budgetCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BudgetCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(budgetCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...budgetCollectionExample.valid(),
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
