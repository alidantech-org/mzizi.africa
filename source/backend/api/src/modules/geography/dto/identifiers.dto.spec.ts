import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IdentifiersDto } from "#/modules/geography/dto/identifiers.dto.ts";
import { identifiersExample } from "#/modules/geography/dto/identifiers.dto.example.ts";

/** Managed by Dryv: IdentifiersDto enforces exactly what the Identifiers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IdentifiersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = identifiersExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IdentifiersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(identifiersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...identifiersExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});