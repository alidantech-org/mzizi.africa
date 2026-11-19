import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailResultsDto } from "#/modules/insights/schema/dto/party-detail-results.dto.ts";
import { partyDetailResultsExample } from "@test/modules/insights/schema/dto/examples/party-detail-results.dto.example.ts";

/** Managed by Dryv: PartyDetailResultsDto enforces exactly what the PartyDetailResults contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailResultsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailResultsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailResultsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailResultsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...partyDetailResultsExample.valid(),
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
