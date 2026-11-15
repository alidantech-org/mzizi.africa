import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitsDto } from "#/modules/geography/schema/dto/units.dto.ts";
import { unitsExample } from "@test/modules/geography/schema/dto/examples/units.dto.example.ts";

/** Managed by Dryv: UnitsDto enforces exactly what the Units contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UnitsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
