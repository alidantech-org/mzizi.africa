import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionHoldersListResponseDto } from "#/modules/political/dto/party-position-holders-list-response.dto.ts";
import { partyPositionHoldersListResponseExample } from "#/modules/political/dto/party-position-holders-list-response.dto.example.ts";

/** Managed by Dryv: PartyPositionHoldersListResponseDto enforces exactly what the PartyPositionHoldersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionHoldersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionHoldersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionHoldersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionHoldersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionHoldersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});