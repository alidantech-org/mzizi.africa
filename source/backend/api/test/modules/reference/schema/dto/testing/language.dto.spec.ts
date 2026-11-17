import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageDto } from "#/modules/reference/schema/dto/language.dto.ts";
import { languageExample } from "@test/modules/reference/schema/dto/examples/language.dto.example.ts";

/** Managed by Dryv: LanguageDto enforces exactly what the Language contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
