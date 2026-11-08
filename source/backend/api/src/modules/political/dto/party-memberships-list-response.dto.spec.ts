import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyMembershipsListResponseDto } from "#/modules/political/dto/party-memberships-list-response.dto.ts";
import { partyMembershipsListResponseExample } from "#/modules/political/dto/party-memberships-list-response.dto.example.ts";

/** Managed by Dryv: PartyMembershipsListResponseDto enforces exactly what the PartyMembershipsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyMembershipsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyMembershipsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyMembershipsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyMembershipsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyMembershipsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});