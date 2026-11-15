import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitEntryNamesDto } from "#/modules/geography/dto/unit-entry-names.dto.ts";
import { unitEntryNamesExample } from "#/modules/geography/dto/examples/unit-entry-names.dto.example.ts";

/** Managed by Dryv: UnitEntryNamesDto enforces exactly what the UnitEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitEntryNamesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("UnitEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitEntryNamesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});