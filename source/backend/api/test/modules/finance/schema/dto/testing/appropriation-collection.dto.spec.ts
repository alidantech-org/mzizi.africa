import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AppropriationCollectionDto } from "#/modules/finance/schema/dto/appropriation-collection.dto.ts";
import { appropriationCollectionExample } from "@test/modules/finance/schema/dto/examples/appropriation-collection.dto.example.ts";

/** Managed by Dryv: AppropriationCollectionDto enforces exactly what the AppropriationCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AppropriationCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = appropriationCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AppropriationCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(appropriationCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...appropriationCollectionExample.valid(),
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
