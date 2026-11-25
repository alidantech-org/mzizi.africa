import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryEntryDto } from "#/modules/reference/schema/dto/country-entry.dto.ts";
import { countryEntryExample } from "@test/modules/reference/schema/dto/examples/country-entry.dto.example.ts";

/** Managed by Dryv: CountryEntryDto enforces exactly what the CountryEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
