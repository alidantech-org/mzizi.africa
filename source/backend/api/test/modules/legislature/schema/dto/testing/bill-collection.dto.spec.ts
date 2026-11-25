import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillCollectionDto } from "#/modules/legislature/schema/dto/bill-collection.dto.ts";
import { billCollectionExample } from "@test/modules/legislature/schema/dto/examples/bill-collection.dto.example.ts";

/** Managed by Dryv: BillCollectionDto enforces exactly what the BillCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
