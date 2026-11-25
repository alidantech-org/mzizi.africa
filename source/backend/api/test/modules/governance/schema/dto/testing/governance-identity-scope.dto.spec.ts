import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceIdentityScopeDto } from "#/modules/governance/schema/dto/governance-identity-scope.dto.ts";
import { governanceIdentityScopeExample } from "@test/modules/governance/schema/dto/examples/governance-identity-scope.dto.example.ts";

/** Managed by Dryv: GovernanceIdentityScopeDto enforces exactly what the GovernanceIdentityScope contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceIdentityScopeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceIdentityScopeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceIdentityScopeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceIdentityScopeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceIdentityScopeExample.valid(),
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
