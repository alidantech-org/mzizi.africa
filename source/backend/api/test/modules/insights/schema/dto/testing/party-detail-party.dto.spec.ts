import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailPartyDto } from "#/modules/insights/schema/dto/party-detail-party.dto.ts";
import { partyDetailPartyExample } from "@test/modules/insights/schema/dto/examples/party-detail-party.dto.example.ts";

/** Managed by Dryv: PartyDetailPartyDto enforces exactly what the PartyDetailParty contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailPartyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailPartyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailPartyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailPartyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailPartyExample.valid(),
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
