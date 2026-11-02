import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PartyIdeologyPublicDto } from "#/modules/political/dto/party-ideology-public.dto.ts";
import { partyIdeologyPublicExample } from "#/modules/political/dto/party-ideology-public.dto.example.ts";

/** Managed by Dryv: PartyIdeologyPublicDto enforces exactly what the PartyIdeologyPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PartyIdeologyPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = partyIdeologyPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PartyIdeologyPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(partyIdeologyPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...partyIdeologyPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});