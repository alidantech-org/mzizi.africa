import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountDto } from "#/modules/identity/dto/account.dto.ts";
import { accountExample } from "#/modules/identity/dto/account.dto.example.ts";

/** Managed by Dryv: AccountDto enforces exactly what the Account contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});