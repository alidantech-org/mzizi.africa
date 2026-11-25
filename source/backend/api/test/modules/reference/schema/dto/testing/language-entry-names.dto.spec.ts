import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageEntryNamesDto } from "#/modules/reference/schema/dto/language-entry-names.dto.ts";
import { languageEntryNamesExample } from "@test/modules/reference/schema/dto/examples/language-entry-names.dto.example.ts";

/** Managed by Dryv: LanguageEntryNamesDto enforces exactly what the LanguageEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...languageEntryNamesExample.valid(),
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
