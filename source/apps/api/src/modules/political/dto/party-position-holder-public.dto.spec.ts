import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionHolderPublicDto } from "#/modules/political/dto/party-position-holder-public.dto.ts";
import { partyPositionHolderPublicExample } from "#/modules/political/dto/party-position-holder-public.dto.example.ts";

/** Managed by Dryv: PartyPositionHolderPublicDto enforces exactly what the PartyPositionHolderPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionHolderPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionHolderPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionHolderPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionHolderPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionHolderPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});