import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillKeyDto } from "#/modules/legislature/schema/dto/bill-key.dto.ts";
import { billKeyExample } from "@test/modules/legislature/schema/dto/examples/bill-key.dto.example.ts";

/** Managed by Dryv: BillKeyDto enforces exactly what the BillKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
