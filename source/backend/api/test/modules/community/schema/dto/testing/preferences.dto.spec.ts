import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PreferencesDto } from "#/modules/community/schema/dto/preferences.dto.ts";
import { preferencesExample } from "@test/modules/community/schema/dto/examples/preferences.dto.example.ts";

/** Managed by Dryv: PreferencesDto enforces exactly what the Preferences contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PreferencesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = preferencesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PreferencesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(preferencesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...preferencesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
