import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityDetailNamesDto } from "#/modules/identity/schema/dto/identity-detail-names.dto.ts";
import { identityDetailNamesExample } from "@test/modules/identity/schema/dto/examples/identity-detail-names.dto.example.ts";

/** Managed by Dryv: IdentityDetailNamesDto enforces exactly what the IdentityDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...identityDetailNamesExample.valid(),
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
