import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyUnitResponseDto } from "#/modules/political/dto/party-unit-response.dto.ts";
import { partyUnitResponseExample } from "#/modules/political/dto/party-unit-response.dto.example.ts";

/** Managed by Dryv: PartyUnitResponseDto enforces exactly what the PartyUnitResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyUnitResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyUnitResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyUnitResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyUnitResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyUnitResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});