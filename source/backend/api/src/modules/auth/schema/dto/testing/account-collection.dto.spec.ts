import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AccountCollectionDto } from "#/modules/auth/schema/dto/account-collection.dto.ts";
import { accountCollectionExample } from "#/modules/auth/schema/dto/examples/account-collection.dto.example.ts";

/** Managed by Dryv: AccountCollectionDto enforces exactly what the AccountCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AccountCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = accountCollectionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AccountCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(accountCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...accountCollectionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});