import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressKeyDto } from "#/modules/identity/schema/dto/address-key.dto.ts";
import { addressKeyExample } from "@test/modules/identity/schema/dto/examples/address-key.dto.example.ts";

/** Managed by Dryv: AddressKeyDto enforces exactly what the AddressKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
