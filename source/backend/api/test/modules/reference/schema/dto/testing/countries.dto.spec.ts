import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountriesDto } from "#/modules/reference/schema/dto/countries.dto.ts";
import { countriesExample } from "@test/modules/reference/schema/dto/examples/countries.dto.example.ts";

/** Managed by Dryv: CountriesDto enforces exactly what the Countries contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountriesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countriesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountriesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countriesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countriesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
