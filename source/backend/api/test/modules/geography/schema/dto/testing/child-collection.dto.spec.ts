import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildCollectionDto } from "#/modules/geography/schema/dto/child-collection.dto.ts";
import { childCollectionExample } from "@test/modules/geography/schema/dto/examples/child-collection.dto.example.ts";

/** Managed by Dryv: ChildCollectionDto enforces exactly what the ChildCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...childCollectionExample.valid(),
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
