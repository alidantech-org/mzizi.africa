import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MoneyEntityDto } from "#/modules/finance/schema/dto/money-entity.dto.ts";
import { moneyEntityExample } from "@test/modules/finance/schema/dto/examples/money-entity.dto.example.ts";

/** Managed by Dryv: MoneyEntityDto enforces exactly what the MoneyEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MoneyEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = moneyEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MoneyEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(moneyEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...moneyEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
