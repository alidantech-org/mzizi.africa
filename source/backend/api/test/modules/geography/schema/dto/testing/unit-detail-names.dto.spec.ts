import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { UnitDetailNamesDto } from "#/modules/geography/schema/dto/unit-detail-names.dto.ts";
import { unitDetailNamesExample } from "@test/modules/geography/schema/dto/examples/unit-detail-names.dto.example.ts";

/** Managed by Dryv: UnitDetailNamesDto enforces exactly what the UnitDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(UnitDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = unitDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("UnitDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(unitDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...unitDetailNamesExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
