import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyIdeologiesListResponseDto } from "#/modules/political/dto/party-ideologies-list-response.dto.ts";
import { partyIdeologiesListResponseExample } from "#/modules/political/dto/party-ideologies-list-response.dto.example.ts";

/** Managed by Dryv: PartyIdeologiesListResponseDto enforces exactly what the PartyIdeologiesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyIdeologiesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyIdeologiesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyIdeologiesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyIdeologiesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyIdeologiesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});