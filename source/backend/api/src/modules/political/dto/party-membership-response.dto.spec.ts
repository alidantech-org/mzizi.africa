import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyMembershipResponseDto } from "#/modules/political/dto/party-membership-response.dto.ts";
import { partyMembershipResponseExample } from "#/modules/political/dto/party-membership-response.dto.example.ts";

/** Managed by Dryv: PartyMembershipResponseDto enforces exactly what the PartyMembershipResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyMembershipResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyMembershipResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyMembershipResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyMembershipResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyMembershipResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});