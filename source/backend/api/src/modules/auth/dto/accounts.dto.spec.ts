import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountsDto } from "#/modules/auth/dto/accounts.dto.ts";
import { accountsExample } from "#/modules/auth/dto/accounts.dto.example.ts";

/** Managed by Dryv: AccountsDto enforces exactly what the Accounts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});