import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PatternDto } from "#/modules/reference/schema/dto/pattern.dto.ts";
import { patternExample } from "#/modules/reference/schema/dto/examples/pattern.dto.example.ts";

/** Managed by Dryv: PatternDto enforces exactly what the Pattern contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PatternDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = patternExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PatternDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(patternExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...patternExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});