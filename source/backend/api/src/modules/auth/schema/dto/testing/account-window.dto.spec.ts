import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountWindowDto } from "#/modules/auth/schema/dto/account-window.dto.ts";
import { accountWindowExample } from "#/modules/auth/schema/dto/examples/account-window.dto.example.ts";

/** Managed by Dryv: AccountWindowDto enforces exactly what the AccountWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountWindowExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});