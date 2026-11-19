import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailFundingDto } from "#/modules/insights/schema/dto/party-detail-funding.dto.ts";
import { partyDetailFundingExample } from "@test/modules/insights/schema/dto/examples/party-detail-funding.dto.example.ts";

/** Managed by Dryv: PartyDetailFundingDto enforces exactly what the PartyDetailFunding contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailFundingDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailFundingExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailFundingDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailFundingExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailFundingExample.valid(),
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
