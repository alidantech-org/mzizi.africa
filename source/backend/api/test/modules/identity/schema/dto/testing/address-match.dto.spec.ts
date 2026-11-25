import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressMatchDto } from "#/modules/identity/schema/dto/address-match.dto.ts";
import { addressMatchExample } from "@test/modules/identity/schema/dto/examples/address-match.dto.example.ts";

/** Managed by Dryv: AddressMatchDto enforces exactly what the AddressMatch contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressMatchDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressMatchExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressMatchDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressMatchExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressMatchExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
