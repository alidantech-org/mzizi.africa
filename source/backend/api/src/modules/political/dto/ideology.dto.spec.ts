import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdeologyDto } from "#/modules/political/dto/ideology.dto.ts";
import { ideologyExample } from "#/modules/political/dto/ideology.dto.example.ts";

/** Managed by Dryv: IdeologyDto enforces exactly what the Ideology contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdeologyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = ideologyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdeologyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(ideologyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...ideologyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});