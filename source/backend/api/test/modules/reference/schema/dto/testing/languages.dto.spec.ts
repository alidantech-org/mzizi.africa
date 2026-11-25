import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LanguagesDto } from "#/modules/reference/schema/dto/languages.dto.ts";
import { languagesExample } from "@test/modules/reference/schema/dto/examples/languages.dto.example.ts";

/** Managed by Dryv: LanguagesDto enforces exactly what the Languages contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LanguagesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = languagesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LanguagesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(languagesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...languagesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
