import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyIdeologyListQueryDto } from "#/modules/political/dto/party-ideology-list-query.dto.ts";
import { partyIdeologyListQueryExample } from "#/modules/political/dto/party-ideology-list-query.dto.example.ts";

/** Managed by Dryv: PartyIdeologyListQueryDto enforces exactly what the PartyIdeologyListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyIdeologyListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyIdeologyListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyIdeologyListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyIdeologyListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyIdeologyListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});