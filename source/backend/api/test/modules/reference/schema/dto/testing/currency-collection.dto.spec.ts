import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CurrencyCollectionDto } from "#/modules/reference/schema/dto/currency-collection.dto.ts";
import { currencyCollectionExample } from "@test/modules/reference/schema/dto/examples/currency-collection.dto.example.ts";

/** Managed by Dryv: CurrencyCollectionDto enforces exactly what the CurrencyCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CurrencyCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = currencyCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CurrencyCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(currencyCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...currencyCollectionExample.valid(),
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
