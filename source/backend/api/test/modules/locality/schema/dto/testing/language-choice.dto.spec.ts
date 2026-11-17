import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageChoiceDto } from "#/modules/locality/schema/dto/language-choice.dto.ts";
import { languageChoiceExample } from "@test/modules/locality/schema/dto/examples/language-choice.dto.example.ts";

/** Managed by Dryv: LanguageChoiceDto enforces exactly what the LanguageChoice contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageChoiceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageChoiceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageChoiceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageChoiceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageChoiceExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
