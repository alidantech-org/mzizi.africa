import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionDto } from "#/modules/political/dto/party-position.dto.ts";
import { partyPositionExample } from "#/modules/political/dto/party-position.dto.example.ts";

/** Managed by Dryv: PartyPositionDto enforces exactly what the PartyPosition contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});