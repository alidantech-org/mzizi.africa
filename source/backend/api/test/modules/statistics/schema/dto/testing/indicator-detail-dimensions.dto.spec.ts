import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorDetailDimensionsDto } from "#/modules/statistics/schema/dto/indicator-detail-dimensions.dto.ts";
import { indicatorDetailDimensionsExample } from "@test/modules/statistics/schema/dto/examples/indicator-detail-dimensions.dto.example.ts";

/** Managed by Dryv: IndicatorDetailDimensionsDto enforces exactly what the IndicatorDetailDimensions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorDetailDimensionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorDetailDimensionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorDetailDimensionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorDetailDimensionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorDetailDimensionsExample.valid(),
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
