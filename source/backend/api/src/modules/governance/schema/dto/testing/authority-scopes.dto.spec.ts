import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AuthorityScopesDto } from "#/modules/governance/schema/dto/authority-scopes.dto.ts";
import { authorityScopesExample } from "#/modules/governance/schema/dto/examples/authority-scopes.dto.example.ts";

/** Managed by Dryv: AuthorityScopesDto enforces exactly what the AuthorityScopes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AuthorityScopesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = authorityScopesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AuthorityScopesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(authorityScopesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...authorityScopesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});