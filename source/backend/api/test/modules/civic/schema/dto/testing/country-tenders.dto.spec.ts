import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryTendersDto } from "#/modules/civic/schema/dto/country-tenders.dto.ts";
import { countryTendersExample } from "@test/modules/civic/schema/dto/examples/country-tenders.dto.example.ts";

/** Managed by Dryv: CountryTendersDto enforces exactly what the CountryTenders contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryTendersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryTendersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryTendersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryTendersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryTendersExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
