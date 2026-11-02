import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyResponseDto } from "#/modules/political/dto/party-response.dto.ts";
import { partyResponseExample } from "#/modules/political/dto/party-response.dto.example.ts";

/** Managed by Dryv: PartyResponseDto enforces exactly what the PartyResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});