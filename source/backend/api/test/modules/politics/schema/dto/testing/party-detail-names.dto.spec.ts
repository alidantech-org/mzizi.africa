import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailNamesDto } from "#/modules/politics/schema/dto/party-detail-names.dto.ts";
import { partyDetailNamesExample } from "@test/modules/politics/schema/dto/examples/party-detail-names.dto.example.ts";

/** Managed by Dryv: PartyDetailNamesDto enforces exactly what the PartyDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailNamesExample.valid(),
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
