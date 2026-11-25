import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillsDto } from "#/modules/legislature/schema/dto/bills.dto.ts";
import { billsExample } from "@test/modules/legislature/schema/dto/examples/bills.dto.example.ts";

/** Managed by Dryv: BillsDto enforces exactly what the Bills contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
