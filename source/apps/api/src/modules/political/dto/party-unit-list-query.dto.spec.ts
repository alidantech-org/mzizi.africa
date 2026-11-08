import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyUnitListQueryDto } from "#/modules/political/dto/party-unit-list-query.dto.ts";
import { partyUnitListQueryExample } from "#/modules/political/dto/party-unit-list-query.dto.example.ts";

/** Managed by Dryv: PartyUnitListQueryDto enforces exactly what the PartyUnitListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyUnitListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyUnitListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyUnitListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyUnitListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyUnitListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});