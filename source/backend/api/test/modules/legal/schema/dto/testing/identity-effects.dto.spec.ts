import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentityEffectsDto } from "#/modules/legal/schema/dto/identity-effects.dto.ts";
import { identityEffectsExample } from "@test/modules/legal/schema/dto/examples/identity-effects.dto.example.ts";

/** Managed by Dryv: IdentityEffectsDto enforces exactly what the IdentityEffects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentityEffectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identityEffectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IdentityEffectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identityEffectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...identityEffectsExample.valid(),
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
