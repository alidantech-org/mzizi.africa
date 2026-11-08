import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LedgerEntryDto } from "#/modules/finance/dto/ledger-entry.dto.ts";
import { ledgerEntryExample } from "#/modules/finance/dto/ledger-entry.dto.example.ts";

/** Managed by Dryv: LedgerEntryDto enforces exactly what the LedgerEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LedgerEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ledgerEntryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LedgerEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ledgerEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ledgerEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});