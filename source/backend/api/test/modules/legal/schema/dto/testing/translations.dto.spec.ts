import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TranslationsDto } from "#/modules/legal/schema/dto/translations.dto.ts";
import { translationsExample } from "@test/modules/legal/schema/dto/examples/translations.dto.example.ts";

/** Managed by Dryv: TranslationsDto enforces exactly what the Translations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TranslationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = translationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TranslationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(translationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...translationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
