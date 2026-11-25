import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryFacilitiesDto } from "#/modules/civic/schema/dto/country-facilities.dto.ts";
import { countryFacilitiesExample } from "@test/modules/civic/schema/dto/examples/country-facilities.dto.example.ts";

/** Managed by Dryv: CountryFacilitiesDto enforces exactly what the CountryFacilities contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryFacilitiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryFacilitiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryFacilitiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryFacilitiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryFacilitiesExample.valid(),
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
