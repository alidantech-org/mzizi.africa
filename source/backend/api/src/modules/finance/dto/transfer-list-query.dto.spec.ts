import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TransferListQueryDto } from "#/modules/finance/dto/transfer-list-query.dto.ts";
import { transferListQueryExample } from "#/modules/finance/dto/transfer-list-query.dto.example.ts";

/** Managed by Dryv: TransferListQueryDto enforces exactly what the TransferListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TransferListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = transferListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("TransferListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(transferListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...transferListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});