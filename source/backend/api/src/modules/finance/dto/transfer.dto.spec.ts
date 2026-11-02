import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TransferDto } from "#/modules/finance/dto/transfer.dto.ts";
import { transferExample } from "#/modules/finance/dto/transfer.dto.example.ts";

/** Managed by Dryv: TransferDto enforces exactly what the Transfer contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TransferDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = transferExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TransferDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(transferExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...transferExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});