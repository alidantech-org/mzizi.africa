import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficeCollectionDto } from "#/modules/governance/schema/dto/office-collection.dto.ts";
import { officeCollectionExample } from "@test/modules/governance/schema/dto/examples/office-collection.dto.example.ts";

/** Managed by Dryv: OfficeCollectionDto enforces exactly what the OfficeCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficeCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officeCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OfficeCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officeCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...officeCollectionExample.valid(),
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
