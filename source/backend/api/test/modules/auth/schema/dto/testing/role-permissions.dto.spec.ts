import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RolePermissionsDto } from "#/modules/auth/schema/dto/role-permissions.dto.ts";
import { rolePermissionsExample } from "@test/modules/auth/schema/dto/examples/role-permissions.dto.example.ts";

/** Managed by Dryv: RolePermissionsDto enforces exactly what the RolePermissions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RolePermissionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rolePermissionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RolePermissionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rolePermissionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...rolePermissionsExample.valid(),
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
