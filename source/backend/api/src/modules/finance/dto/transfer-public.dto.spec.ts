import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TransferPublicDto } from "#/modules/finance/dto/transfer-public.dto.ts";
import { transferPublicExample } from "#/modules/finance/dto/transfer-public.dto.example.ts";

/** Managed by Dryv: TransferPublicDto enforces exactly what the TransferPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TransferPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = transferPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TransferPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(transferPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...transferPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});