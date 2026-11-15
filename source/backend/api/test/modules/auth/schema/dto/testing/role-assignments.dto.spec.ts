import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RoleAssignmentsDto } from "#/modules/auth/schema/dto/role-assignments.dto.ts";
import { roleAssignmentsExample } from "@test/modules/auth/schema/dto/examples/role-assignments.dto.example.ts";

/** Managed by Dryv: RoleAssignmentsDto enforces exactly what the RoleAssignments contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RoleAssignmentsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = roleAssignmentsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("RoleAssignmentsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(roleAssignmentsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...roleAssignmentsExample.valid(),
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
