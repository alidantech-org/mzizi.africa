import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsTopicsIndicatorsDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators.dto.ts";
import { placeStatisticsTopicsIndicatorsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsTopicsIndicatorsDto enforces exactly what the PlaceStatisticsTopicsIndicators contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsTopicsIndicatorsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsTopicsIndicatorsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsTopicsIndicatorsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsTopicsIndicatorsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsTopicsIndicatorsExample.valid(),
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
