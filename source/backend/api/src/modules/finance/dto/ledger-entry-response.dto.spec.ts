import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LedgerEntryResponseDto } from "#/modules/finance/dto/ledger-entry-response.dto.ts";
import { ledgerEntryResponseExample } from "#/modules/finance/dto/ledger-entry-response.dto.example.ts";

/** Managed by Dryv: LedgerEntryResponseDto enforces exactly what the LedgerEntryResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LedgerEntryResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ledgerEntryResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LedgerEntryResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ledgerEntryResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ledgerEntryResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});