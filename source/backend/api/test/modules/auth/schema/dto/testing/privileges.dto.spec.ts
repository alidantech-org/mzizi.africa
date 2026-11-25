import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PrivilegesDto } from "#/modules/auth/schema/dto/privileges.dto.ts";
import { privilegesExample } from "@test/modules/auth/schema/dto/examples/privileges.dto.example.ts";

/** Managed by Dryv: PrivilegesDto enforces exactly what the Privileges contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PrivilegesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = privilegesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PrivilegesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(privilegesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...privilegesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
