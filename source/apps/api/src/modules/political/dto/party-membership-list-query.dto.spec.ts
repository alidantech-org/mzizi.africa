import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyMembershipListQueryDto } from "#/modules/political/dto/party-membership-list-query.dto.ts";
import { partyMembershipListQueryExample } from "#/modules/political/dto/party-membership-list-query.dto.example.ts";

/** Managed by Dryv: PartyMembershipListQueryDto enforces exactly what the PartyMembershipListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyMembershipListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyMembershipListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyMembershipListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyMembershipListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyMembershipListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});