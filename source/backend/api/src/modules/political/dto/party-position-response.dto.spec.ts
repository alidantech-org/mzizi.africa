import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionResponseDto } from "#/modules/political/dto/party-position-response.dto.ts";
import { partyPositionResponseExample } from "#/modules/political/dto/party-position-response.dto.example.ts";

/** Managed by Dryv: PartyPositionResponseDto enforces exactly what the PartyPositionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});