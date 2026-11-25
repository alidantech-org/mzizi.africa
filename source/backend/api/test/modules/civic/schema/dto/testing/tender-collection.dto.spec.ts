import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TenderCollectionDto } from "#/modules/civic/schema/dto/tender-collection.dto.ts";
import { tenderCollectionExample } from "@test/modules/civic/schema/dto/examples/tender-collection.dto.example.ts";

/** Managed by Dryv: TenderCollectionDto enforces exactly what the TenderCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TenderCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tenderCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TenderCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tenderCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...tenderCollectionExample.valid(),
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
