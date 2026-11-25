import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillEntryNamesDto } from "#/modules/legislature/schema/dto/bill-entry-names.dto.ts";
import { billEntryNamesExample } from "@test/modules/legislature/schema/dto/examples/bill-entry-names.dto.example.ts";

/** Managed by Dryv: BillEntryNamesDto enforces exactly what the BillEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billEntryNamesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
