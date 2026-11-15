import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttributionsDto } from "#/modules/source/dto/attributions.dto.ts";
import { attributionsExample } from "#/modules/source/dto/attributions.dto.example.ts";

/** Managed by Dryv: AttributionsDto enforces exactly what the Attributions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttributionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attributionsExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AttributionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attributionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attributionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});