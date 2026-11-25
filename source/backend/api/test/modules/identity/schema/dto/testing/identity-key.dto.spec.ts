import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityKeyDto } from "#/modules/identity/schema/dto/identity-key.dto.ts";
import { identityKeyExample } from "@test/modules/identity/schema/dto/examples/identity-key.dto.example.ts";

/** Managed by Dryv: IdentityKeyDto enforces exactly what the IdentityKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...identityKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
