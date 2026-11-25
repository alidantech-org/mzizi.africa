import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryDetailNamesDto } from "#/modules/reference/schema/dto/country-detail-names.dto.ts";
import { countryDetailNamesExample } from "@test/modules/reference/schema/dto/examples/country-detail-names.dto.example.ts";

/** Managed by Dryv: CountryDetailNamesDto enforces exactly what the CountryDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryDetailNamesExample.valid(),
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
