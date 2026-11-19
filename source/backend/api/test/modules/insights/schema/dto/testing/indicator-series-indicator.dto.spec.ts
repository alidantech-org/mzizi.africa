import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorSeriesIndicatorDto } from "#/modules/insights/schema/dto/indicator-series-indicator.dto.ts";
import { indicatorSeriesIndicatorExample } from "@test/modules/insights/schema/dto/examples/indicator-series-indicator.dto.example.ts";

/** Managed by Dryv: IndicatorSeriesIndicatorDto enforces exactly what the IndicatorSeriesIndicator contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorSeriesIndicatorDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorSeriesIndicatorExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorSeriesIndicatorDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorSeriesIndicatorExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorSeriesIndicatorExample.valid(),
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
