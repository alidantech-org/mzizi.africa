import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountReadDto } from "#/modules/auth/schema/dto/account-read.dto.ts";
import { accountReadExample } from "#/modules/auth/schema/dto/examples/account-read.dto.example.ts";

/** Managed by Dryv: AccountReadDto enforces exactly what the AccountRead contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountReadDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountReadExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountReadDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountReadExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountReadExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});