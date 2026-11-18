import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DebtsDto } from "#/modules/finance/schema/dto/debts.dto.ts";
import { debtsExample } from "@test/modules/finance/schema/dto/examples/debts.dto.example.ts";

/** Managed by Dryv: DebtsDto enforces exactly what the Debts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DebtsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = debtsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DebtsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(debtsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...debtsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
