import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitWindowDto } from "#/modules/geography/dto/unit-window.dto.ts";
import { unitWindowExample } from "#/modules/geography/dto/examples/unit-window.dto.example.ts";

/** Managed by Dryv: UnitWindowDto enforces exactly what the UnitWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitWindowExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("UnitWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});