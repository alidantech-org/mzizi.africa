import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyPublicDto } from "#/modules/political/dto/party-public.dto.ts";
import { partyPublicExample } from "#/modules/political/dto/party-public.dto.example.ts";

/** Managed by Dryv: PartyPublicDto enforces exactly what the PartyPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});