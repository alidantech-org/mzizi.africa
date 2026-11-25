import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { BillWindowDto } from "#/modules/legislature/schema/dto/bill-window.dto.ts";
import { billWindowExample } from "@test/modules/legislature/schema/dto/examples/bill-window.dto.example.ts";

/** Managed by Dryv: BillWindowDto enforces exactly what the BillWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(BillWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = billWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("BillWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(billWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...billWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
