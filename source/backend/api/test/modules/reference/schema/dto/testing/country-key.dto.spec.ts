import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryKeyDto } from "#/modules/reference/schema/dto/country-key.dto.ts";
import { countryKeyExample } from "@test/modules/reference/schema/dto/examples/country-key.dto.example.ts";

/** Managed by Dryv: CountryKeyDto enforces exactly what the CountryKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
