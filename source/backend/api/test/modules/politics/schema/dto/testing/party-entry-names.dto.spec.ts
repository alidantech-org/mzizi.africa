import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyEntryNamesDto } from "#/modules/politics/schema/dto/party-entry-names.dto.ts";
import { partyEntryNamesExample } from "@test/modules/politics/schema/dto/examples/party-entry-names.dto.example.ts";

/** Managed by Dryv: PartyEntryNamesDto enforces exactly what the PartyEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyEntryNamesExample.valid(),
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
