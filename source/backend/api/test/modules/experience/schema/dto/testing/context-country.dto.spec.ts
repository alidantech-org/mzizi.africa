import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContextCountryDto } from "#/modules/experience/schema/dto/context-country.dto.ts";
import { contextCountryExample } from "@test/modules/experience/schema/dto/examples/context-country.dto.example.ts";

/** Managed by Dryv: ContextCountryDto enforces exactly what the ContextCountry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContextCountryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contextCountryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContextCountryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contextCountryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contextCountryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
