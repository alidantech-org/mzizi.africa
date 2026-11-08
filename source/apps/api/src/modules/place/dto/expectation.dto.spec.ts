import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExpectationDto } from "#/modules/place/dto/expectation.dto.ts";
import { expectationExample } from "#/modules/place/dto/expectation.dto.example.ts";

/** Managed by Dryv: ExpectationDto enforces exactly what the Expectation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExpectationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = expectationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExpectationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(expectationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...expectationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});