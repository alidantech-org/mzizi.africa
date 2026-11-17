import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageListDto } from "#/modules/locality/schema/dto/language-list.dto.ts";
import { languageListExample } from "@test/modules/locality/schema/dto/examples/language-list.dto.example.ts";

/** Managed by Dryv: LanguageListDto enforces exactly what the LanguageList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languageListExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
