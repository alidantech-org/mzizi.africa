import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountryContextDocumentDto } from "#/modules/structure/schema/dto/country-context-document.dto.ts";
import { countryContextDocumentExample } from "@test/modules/structure/schema/dto/examples/country-context-document.dto.example.ts";

/** Managed by Dryv: CountryContextDocumentDto enforces exactly what the CountryContextDocument contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountryContextDocumentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countryContextDocumentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountryContextDocumentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countryContextDocumentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countryContextDocumentExample.valid(),
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
