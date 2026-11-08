import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LedgerEntryPublicDto } from "#/modules/finance/dto/ledger-entry-public.dto.ts";
import { ledgerEntryPublicExample } from "#/modules/finance/dto/ledger-entry-public.dto.example.ts";

/** Managed by Dryv: LedgerEntryPublicDto enforces exactly what the LedgerEntryPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LedgerEntryPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ledgerEntryPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LedgerEntryPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ledgerEntryPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ledgerEntryPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});