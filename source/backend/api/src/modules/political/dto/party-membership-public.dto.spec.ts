import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyMembershipPublicDto } from "#/modules/political/dto/party-membership-public.dto.ts";
import { partyMembershipPublicExample } from "#/modules/political/dto/party-membership-public.dto.example.ts";

/** Managed by Dryv: PartyMembershipPublicDto enforces exactly what the PartyMembershipPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyMembershipPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyMembershipPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyMembershipPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyMembershipPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyMembershipPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});