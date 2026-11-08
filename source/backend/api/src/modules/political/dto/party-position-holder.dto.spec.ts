import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionHolderDto } from "#/modules/political/dto/party-position-holder.dto.ts";
import { partyPositionHolderExample } from "#/modules/political/dto/party-position-holder.dto.example.ts";

/** Managed by Dryv: PartyPositionHolderDto enforces exactly what the PartyPositionHolder contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionHolderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionHolderExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionHolderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionHolderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionHolderExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});