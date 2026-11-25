import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryDetailDto } from "#/modules/reference/schema/dto/country-detail.dto.ts";
import { countryDetailExample } from "@test/modules/reference/schema/dto/examples/country-detail.dto.example.ts";

/** Managed by Dryv: CountryDetailDto enforces exactly what the CountryDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
