import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AddressPlaceDto } from "#/modules/explorer/schema/dto/address-place.dto.ts";
import { addressPlaceExample } from "@test/modules/explorer/schema/dto/examples/address-place.dto.example.ts";

/** Managed by Dryv: AddressPlaceDto enforces exactly what the AddressPlace contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AddressPlaceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = addressPlaceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("AddressPlaceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(addressPlaceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...addressPlaceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
