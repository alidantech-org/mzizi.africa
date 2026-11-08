import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionListQueryDto } from "#/modules/political/dto/party-position-list-query.dto.ts";
import { partyPositionListQueryExample } from "#/modules/political/dto/party-position-list-query.dto.example.ts";

/** Managed by Dryv: PartyPositionListQueryDto enforces exactly what the PartyPositionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});