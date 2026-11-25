import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryElectionsDto } from "#/modules/election/schema/dto/country-elections.dto.ts";
import { countryElectionsExample } from "@test/modules/election/schema/dto/examples/country-elections.dto.example.ts";

/** Managed by Dryv: CountryElectionsDto enforces exactly what the CountryElections contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryElectionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryElectionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryElectionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryElectionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryElectionsExample.valid(),
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
