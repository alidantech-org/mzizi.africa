import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocalesDto } from "#/modules/reference/schema/dto/locales.dto.ts";
import { localesExample } from "@test/modules/reference/schema/dto/examples/locales.dto.example.ts";

/** Managed by Dryv: LocalesDto enforces exactly what the Locales contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocalesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = localesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocalesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(localesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...localesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
