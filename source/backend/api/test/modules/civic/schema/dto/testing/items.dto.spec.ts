import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ItemsDto } from "#/modules/civic/schema/dto/items.dto.ts";
import { itemsExample } from "@test/modules/civic/schema/dto/examples/items.dto.example.ts";

/** Managed by Dryv: ItemsDto enforces exactly what the Items contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ItemsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = itemsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ItemsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(itemsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...itemsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
