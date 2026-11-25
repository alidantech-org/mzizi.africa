import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryLinkDto } from "#/modules/frontend/schema/dto/country-link.dto.ts";
import { countryLinkExample } from "@test/modules/frontend/schema/dto/examples/country-link.dto.example.ts";

/** Managed by Dryv: CountryLinkDto enforces exactly what the CountryLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryLinkExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
