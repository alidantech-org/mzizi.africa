import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillDetailDto } from "#/modules/legislature/schema/dto/bill-detail.dto.ts";
import { billDetailExample } from "@test/modules/legislature/schema/dto/examples/bill-detail.dto.example.ts";

/** Managed by Dryv: BillDetailDto enforces exactly what the BillDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
