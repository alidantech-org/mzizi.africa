import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorSeriesDto } from "#/modules/insights/schema/dto/indicator-series.dto.ts";
import { indicatorSeriesExample } from "@test/modules/insights/schema/dto/examples/indicator-series.dto.example.ts";

/** Managed by Dryv: IndicatorSeriesDto enforces exactly what the IndicatorSeries contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorSeriesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorSeriesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorSeriesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorSeriesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorSeriesExample.valid(),
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
