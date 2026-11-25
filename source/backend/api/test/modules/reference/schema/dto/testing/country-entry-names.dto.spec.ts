import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryEntryNamesDto } from "#/modules/reference/schema/dto/country-entry-names.dto.ts";
import { countryEntryNamesExample } from "@test/modules/reference/schema/dto/examples/country-entry-names.dto.example.ts";

/** Managed by Dryv: CountryEntryNamesDto enforces exactly what the CountryEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryEntryNamesExample.valid(),
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
