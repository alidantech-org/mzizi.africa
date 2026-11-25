import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CurrencyEntryNamesDto } from "#/modules/reference/schema/dto/currency-entry-names.dto.ts";
import { currencyEntryNamesExample } from "@test/modules/reference/schema/dto/examples/currency-entry-names.dto.example.ts";

/** Managed by Dryv: CurrencyEntryNamesDto enforces exactly what the CurrencyEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CurrencyEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = currencyEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CurrencyEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(currencyEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...currencyEntryNamesExample.valid(),
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
