import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CurrenciesDto } from "#/modules/reference/schema/dto/currencies.dto.ts";
import { currenciesExample } from "@test/modules/reference/schema/dto/examples/currencies.dto.example.ts";

/** Managed by Dryv: CurrenciesDto enforces exactly what the Currencies contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CurrenciesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = currenciesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CurrenciesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(currenciesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...currenciesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
