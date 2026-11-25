import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PricesDto } from "#/modules/economy/schema/dto/prices.dto.ts";
import { pricesExample } from "@test/modules/economy/schema/dto/examples/prices.dto.example.ts";

/** Managed by Dryv: PricesDto enforces exactly what the Prices contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PricesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = pricesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PricesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(pricesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...pricesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
