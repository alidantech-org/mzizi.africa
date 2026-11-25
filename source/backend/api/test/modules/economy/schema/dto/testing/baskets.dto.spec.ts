import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BasketsDto } from "#/modules/economy/schema/dto/baskets.dto.ts";
import { basketsExample } from "@test/modules/economy/schema/dto/examples/baskets.dto.example.ts";

/** Managed by Dryv: BasketsDto enforces exactly what the Baskets contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BasketsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = basketsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BasketsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(basketsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...basketsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
