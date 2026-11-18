import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryChoiceDto } from "#/modules/experience/schema/dto/country-choice.dto.ts";
import { countryChoiceExample } from "@test/modules/experience/schema/dto/examples/country-choice.dto.example.ts";

/** Managed by Dryv: CountryChoiceDto enforces exactly what the CountryChoice contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryChoiceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryChoiceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryChoiceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryChoiceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryChoiceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
