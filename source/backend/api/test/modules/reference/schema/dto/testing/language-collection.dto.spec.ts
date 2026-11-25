import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguageCollectionDto } from "#/modules/reference/schema/dto/language-collection.dto.ts";
import { languageCollectionExample } from "@test/modules/reference/schema/dto/examples/language-collection.dto.example.ts";

/** Managed by Dryv: LanguageCollectionDto enforces exactly what the LanguageCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguageCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languageCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguageCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languageCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...languageCollectionExample.valid(),
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
