import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryCollectionDto } from "#/modules/reference/schema/dto/country-collection.dto.ts";
import { countryCollectionExample } from "@test/modules/reference/schema/dto/examples/country-collection.dto.example.ts";

/** Managed by Dryv: CountryCollectionDto enforces exactly what the CountryCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryCollectionExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
