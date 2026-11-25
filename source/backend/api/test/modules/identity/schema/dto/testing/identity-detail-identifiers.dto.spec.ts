import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityDetailIdentifiersDto } from "#/modules/identity/schema/dto/identity-detail-identifiers.dto.ts";
import { identityDetailIdentifiersExample } from "@test/modules/identity/schema/dto/examples/identity-detail-identifiers.dto.example.ts";

/** Managed by Dryv: IdentityDetailIdentifiersDto enforces exactly what the IdentityDetailIdentifiers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityDetailIdentifiersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityDetailIdentifiersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityDetailIdentifiersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityDetailIdentifiersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...identityDetailIdentifiersExample.valid(),
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
