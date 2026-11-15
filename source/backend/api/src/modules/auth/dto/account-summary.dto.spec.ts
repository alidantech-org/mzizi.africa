import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountSummaryDto } from "#/modules/auth/dto/account-summary.dto.ts";
import { accountSummaryExample } from "#/modules/auth/dto/account-summary.dto.example.ts";

/** Managed by Dryv: AccountSummaryDto enforces exactly what the AccountSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});