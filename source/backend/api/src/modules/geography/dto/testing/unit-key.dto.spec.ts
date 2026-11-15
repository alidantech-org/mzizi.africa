import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitKeyDto } from "#/modules/geography/dto/unit-key.dto.ts";
import { unitKeyExample } from "#/modules/geography/dto/examples/unit-key.dto.example.ts";

/** Managed by Dryv: UnitKeyDto enforces exactly what the UnitKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitKeyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("UnitKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});