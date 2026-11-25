import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryDetailLocalesDto } from "#/modules/reference/schema/dto/country-detail-locales.dto.ts";
import { countryDetailLocalesExample } from "@test/modules/reference/schema/dto/examples/country-detail-locales.dto.example.ts";

/** Managed by Dryv: CountryDetailLocalesDto enforces exactly what the CountryDetailLocales contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryDetailLocalesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryDetailLocalesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryDetailLocalesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryDetailLocalesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryDetailLocalesExample.valid(),
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
