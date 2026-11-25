import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageOptionDto } from "#/modules/frontend/schema/dto/language-option.dto.ts";
import { languageOptionExample } from "@test/modules/frontend/schema/dto/examples/language-option.dto.example.ts";

/** Managed by Dryv: LanguageOptionDto enforces exactly what the LanguageOption contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageOptionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageOptionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageOptionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageOptionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageOptionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
