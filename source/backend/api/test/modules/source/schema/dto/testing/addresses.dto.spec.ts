import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressesDto } from "#/modules/source/schema/dto/addresses.dto.ts";
import { addressesExample } from "@test/modules/source/schema/dto/examples/addresses.dto.example.ts";

/** Managed by Dryv: AddressesDto enforces exactly what the Addresses contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
