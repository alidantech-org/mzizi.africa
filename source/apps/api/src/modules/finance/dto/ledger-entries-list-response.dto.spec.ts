import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LedgerEntriesListResponseDto } from "#/modules/finance/dto/ledger-entries-list-response.dto.ts";
import { ledgerEntriesListResponseExample } from "#/modules/finance/dto/ledger-entries-list-response.dto.example.ts";

/** Managed by Dryv: LedgerEntriesListResponseDto enforces exactly what the LedgerEntriesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LedgerEntriesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ledgerEntriesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LedgerEntriesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ledgerEntriesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ledgerEntriesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});