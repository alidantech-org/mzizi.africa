import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryDto } from "#/modules/reference/dto/country.dto.ts";
import { countryExample } from "#/modules/reference/dto/examples/country.dto.example.ts";

/** Managed by Dryv: CountryDto enforces exactly what the Country contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CountryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});