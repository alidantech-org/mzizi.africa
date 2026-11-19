import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailMembersDto } from "#/modules/insights/schema/dto/party-detail-members.dto.ts";
import { partyDetailMembersExample } from "@test/modules/insights/schema/dto/examples/party-detail-members.dto.example.ts";

/** Managed by Dryv: PartyDetailMembersDto enforces exactly what the PartyDetailMembers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailMembersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailMembersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailMembersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailMembersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailMembersExample.valid(),
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
