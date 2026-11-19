import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorMapUnitsDto } from "#/modules/insights/schema/dto/indicator-map-units.dto.ts";
import { indicatorMapUnitsExample } from "@test/modules/insights/schema/dto/examples/indicator-map-units.dto.example.ts";

/** Managed by Dryv: IndicatorMapUnitsDto enforces exactly what the IndicatorMapUnits contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorMapUnitsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorMapUnitsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorMapUnitsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorMapUnitsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorMapUnitsExample.valid(),
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
