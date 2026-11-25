import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailCoalitionsDto } from "#/modules/politics/schema/dto/party-detail-coalitions.dto.ts";
import { partyDetailCoalitionsExample } from "@test/modules/politics/schema/dto/examples/party-detail-coalitions.dto.example.ts";

/** Managed by Dryv: PartyDetailCoalitionsDto enforces exactly what the PartyDetailCoalitions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailCoalitionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailCoalitionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailCoalitionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailCoalitionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailCoalitionsExample.valid(),
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
