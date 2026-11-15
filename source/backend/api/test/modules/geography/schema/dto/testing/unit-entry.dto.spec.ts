import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitEntryDto } from "#/modules/geography/schema/dto/unit-entry.dto.ts";
import { unitEntryExample } from "@test/modules/geography/schema/dto/examples/unit-entry.dto.example.ts";

/** Managed by Dryv: UnitEntryDto enforces exactly what the UnitEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UnitEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
