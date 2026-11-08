import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPositionHolderListQueryDto } from "#/modules/political/dto/party-position-holder-list-query.dto.ts";
import { partyPositionHolderListQueryExample } from "#/modules/political/dto/party-position-holder-list-query.dto.example.ts";

/** Managed by Dryv: PartyPositionHolderListQueryDto enforces exactly what the PartyPositionHolderListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPositionHolderListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPositionHolderListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPositionHolderListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPositionHolderListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPositionHolderListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});