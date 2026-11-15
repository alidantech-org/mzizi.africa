import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitDto } from "#/modules/reference/schema/dto/unit.dto.ts";
import { unitExample } from "@test/modules/reference/schema/dto/examples/unit.dto.example.ts";

/** Managed by Dryv: UnitDto enforces exactly what the Unit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...unitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
