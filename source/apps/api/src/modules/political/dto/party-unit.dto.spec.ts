import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyUnitDto } from "#/modules/political/dto/party-unit.dto.ts";
import { partyUnitExample } from "#/modules/political/dto/party-unit.dto.example.ts";

/** Managed by Dryv: PartyUnitDto enforces exactly what the PartyUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyUnitExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyUnitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});