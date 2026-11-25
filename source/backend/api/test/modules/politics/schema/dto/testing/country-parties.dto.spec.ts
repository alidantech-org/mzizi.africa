import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryPartiesDto } from "#/modules/politics/schema/dto/country-parties.dto.ts";
import { countryPartiesExample } from "@test/modules/politics/schema/dto/examples/country-parties.dto.example.ts";

/** Managed by Dryv: CountryPartiesDto enforces exactly what the CountryParties contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryPartiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryPartiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryPartiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryPartiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryPartiesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
