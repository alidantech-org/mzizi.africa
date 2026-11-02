import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyIdeologyResponseDto } from "#/modules/political/dto/party-ideology-response.dto.ts";
import { partyIdeologyResponseExample } from "#/modules/political/dto/party-ideology-response.dto.example.ts";

/** Managed by Dryv: PartyIdeologyResponseDto enforces exactly what the PartyIdeologyResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyIdeologyResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyIdeologyResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyIdeologyResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyIdeologyResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyIdeologyResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});