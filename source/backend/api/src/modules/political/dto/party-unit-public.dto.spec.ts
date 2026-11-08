import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyUnitPublicDto } from "#/modules/political/dto/party-unit-public.dto.ts";
import { partyUnitPublicExample } from "#/modules/political/dto/party-unit-public.dto.example.ts";

/** Managed by Dryv: PartyUnitPublicDto enforces exactly what the PartyUnitPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyUnitPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyUnitPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyUnitPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyUnitPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyUnitPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});