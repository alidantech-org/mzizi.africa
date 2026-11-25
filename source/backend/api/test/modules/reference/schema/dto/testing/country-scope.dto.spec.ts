import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryScopeDto } from "#/modules/reference/schema/dto/country-scope.dto.ts";
import { countryScopeExample } from "@test/modules/reference/schema/dto/examples/country-scope.dto.example.ts";

/** Managed by Dryv: CountryScopeDto enforces exactly what the CountryScope contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryScopeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryScopeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryScopeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryScopeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...countryScopeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
