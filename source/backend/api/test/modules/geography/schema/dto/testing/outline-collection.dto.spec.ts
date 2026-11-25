import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OutlineCollectionDto } from "#/modules/geography/schema/dto/outline-collection.dto.ts";
import { outlineCollectionExample } from "@test/modules/geography/schema/dto/examples/outline-collection.dto.example.ts";

/** Managed by Dryv: OutlineCollectionDto enforces exactly what the OutlineCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OutlineCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = outlineCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OutlineCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(outlineCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...outlineCollectionExample.valid(),
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
