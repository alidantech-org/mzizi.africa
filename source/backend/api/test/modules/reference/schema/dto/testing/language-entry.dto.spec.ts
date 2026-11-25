import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageEntryDto } from "#/modules/reference/schema/dto/language-entry.dto.ts";
import { languageEntryExample } from "@test/modules/reference/schema/dto/examples/language-entry.dto.example.ts";

/** Managed by Dryv: LanguageEntryDto enforces exactly what the LanguageEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
