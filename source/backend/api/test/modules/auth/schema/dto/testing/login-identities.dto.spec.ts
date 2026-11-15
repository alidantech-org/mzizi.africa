import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoginIdentitiesDto } from "#/modules/auth/schema/dto/login-identities.dto.ts";
import { loginIdentitiesExample } from "@test/modules/auth/schema/dto/examples/login-identities.dto.example.ts";

/** Managed by Dryv: LoginIdentitiesDto enforces exactly what the LoginIdentities contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoginIdentitiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loginIdentitiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LoginIdentitiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loginIdentitiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...loginIdentitiesExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
