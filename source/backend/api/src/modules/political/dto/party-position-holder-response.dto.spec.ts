import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionHolderResponseDto } from "#/modules/political/dto/party-position-holder-response.dto.ts";
import { partyPositionHolderResponseExample } from "#/modules/political/dto/party-position-holder-response.dto.example.ts";

/** Managed by Dryv: PartyPositionHolderResponseDto enforces exactly what the PartyPositionHolderResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionHolderResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionHolderResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionHolderResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionHolderResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionHolderResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});