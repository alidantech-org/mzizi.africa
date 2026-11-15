import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DelegationRolesDto } from "#/modules/auth/schema/dto/delegation-roles.dto.ts";
import { delegationRolesExample } from "@test/modules/auth/schema/dto/examples/delegation-roles.dto.example.ts";

/** Managed by Dryv: DelegationRolesDto enforces exactly what the DelegationRoles contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DelegationRolesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = delegationRolesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DelegationRolesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(delegationRolesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...delegationRolesExample.valid(),
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
