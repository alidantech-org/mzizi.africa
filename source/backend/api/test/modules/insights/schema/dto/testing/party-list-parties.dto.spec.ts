import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyListPartiesDto } from "#/modules/insights/schema/dto/party-list-parties.dto.ts";
import { partyListPartiesExample } from "@test/modules/insights/schema/dto/examples/party-list-parties.dto.example.ts";

/** Managed by Dryv: PartyListPartiesDto enforces exactly what the PartyListParties contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyListPartiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyListPartiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyListPartiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyListPartiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyListPartiesExample.valid(),
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
