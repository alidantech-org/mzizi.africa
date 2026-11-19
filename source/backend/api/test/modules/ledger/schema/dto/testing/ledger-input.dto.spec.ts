import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LedgerInputDto } from "#/modules/ledger/schema/dto/ledger-input.dto.ts";
import { ledgerInputExample } from "@test/modules/ledger/schema/dto/examples/ledger-input.dto.example.ts";

/** Managed by Dryv: LedgerInputDto enforces exactly what the LedgerInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LedgerInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ledgerInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LedgerInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ledgerInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ledgerInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
