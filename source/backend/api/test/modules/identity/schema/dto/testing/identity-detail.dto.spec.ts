import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityDetailDto } from "#/modules/identity/schema/dto/identity-detail.dto.ts";
import { identityDetailExample } from "@test/modules/identity/schema/dto/examples/identity-detail.dto.example.ts";

/** Managed by Dryv: IdentityDetailDto enforces exactly what the IdentityDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...identityDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
