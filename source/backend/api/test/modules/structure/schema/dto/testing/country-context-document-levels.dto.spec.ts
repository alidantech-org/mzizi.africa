import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryContextDocumentLevelsDto } from "#/modules/structure/schema/dto/country-context-document-levels.dto.ts";
import { countryContextDocumentLevelsExample } from "@test/modules/structure/schema/dto/examples/country-context-document-levels.dto.example.ts";

/** Managed by Dryv: CountryContextDocumentLevelsDto enforces exactly what the CountryContextDocumentLevels contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryContextDocumentLevelsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryContextDocumentLevelsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryContextDocumentLevelsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryContextDocumentLevelsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryContextDocumentLevelsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
