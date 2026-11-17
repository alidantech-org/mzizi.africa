import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageNameDto } from "#/modules/reference/schema/dto/language-name.dto.ts";
import { languageNameExample } from "@test/modules/reference/schema/dto/examples/language-name.dto.example.ts";

/** Managed by Dryv: LanguageNameDto enforces exactly what the LanguageName contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageNameDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageNameExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageNameDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageNameExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageNameExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
