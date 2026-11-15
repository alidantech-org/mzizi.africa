import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RolesDto } from "#/modules/auth/schema/dto/roles.dto.ts";
import { rolesExample } from "#/modules/auth/schema/dto/examples/roles.dto.example.ts";

/** Managed by Dryv: RolesDto enforces exactly what the Roles contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RolesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = rolesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RolesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(rolesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...rolesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});