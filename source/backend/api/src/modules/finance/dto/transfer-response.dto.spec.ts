import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TransferResponseDto } from "#/modules/finance/dto/transfer-response.dto.ts";
import { transferResponseExample } from "#/modules/finance/dto/transfer-response.dto.example.ts";

/** Managed by Dryv: TransferResponseDto enforces exactly what the TransferResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TransferResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = transferResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TransferResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(transferResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...transferResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});