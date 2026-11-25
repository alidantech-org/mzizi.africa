import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyDetailDto } from "#/modules/politics/schema/dto/party-detail.dto.ts";
import { partyDetailExample } from "@test/modules/politics/schema/dto/examples/party-detail.dto.example.ts";

/** Managed by Dryv: PartyDetailDto enforces exactly what the PartyDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PartyDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
