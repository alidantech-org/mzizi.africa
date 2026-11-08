import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyIdeologyDto } from "#/modules/political/dto/party-ideology.dto.ts";
import { partyIdeologyExample } from "#/modules/political/dto/party-ideology.dto.example.ts";

/** Managed by Dryv: PartyIdeologyDto enforces exactly what the PartyIdeology contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyIdeologyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyIdeologyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyIdeologyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyIdeologyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyIdeologyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});