import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressMatchesDto } from "#/modules/identity/schema/dto/address-matches.dto.ts";
import { addressMatchesExample } from "@test/modules/identity/schema/dto/examples/address-matches.dto.example.ts";

/** Managed by Dryv: AddressMatchesDto enforces exactly what the AddressMatches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressMatchesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressMatchesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressMatchesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressMatchesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressMatchesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
