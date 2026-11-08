import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyUnitsListResponseDto } from "#/modules/political/dto/party-units-list-response.dto.ts";
import { partyUnitsListResponseExample } from "#/modules/political/dto/party-units-list-response.dto.example.ts";

/** Managed by Dryv: PartyUnitsListResponseDto enforces exactly what the PartyUnitsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyUnitsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyUnitsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyUnitsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyUnitsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyUnitsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});