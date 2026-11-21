import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressesInputDto } from "#/modules/explorer/schema/dto/addresses-input.dto.ts";
import { addressesInputExample } from "@test/modules/explorer/schema/dto/examples/addresses-input.dto.example.ts";

/** Managed by Dryv: AddressesInputDto enforces exactly what the AddressesInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressesInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressesInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressesInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressesInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressesInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
