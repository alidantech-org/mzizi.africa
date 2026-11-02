import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountGrantDto } from "#/modules/identity/dto/account-grant.dto.ts";
import { accountGrantExample } from "#/modules/identity/dto/account-grant.dto.example.ts";

/** Managed by Dryv: AccountGrantDto enforces exactly what the AccountGrant contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountGrantDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountGrantExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountGrantDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountGrantExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountGrantExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});