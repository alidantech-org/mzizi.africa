import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsTopicsIndicatorsLatestDto } from "#/modules/insights/schema/dto/place-statistics-topics-indicators-latest.dto.ts";
import { placeStatisticsTopicsIndicatorsLatestExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics-indicators-latest.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsTopicsIndicatorsLatestDto enforces exactly what the PlaceStatisticsTopicsIndicatorsLatest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsTopicsIndicatorsLatestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsTopicsIndicatorsLatestExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsTopicsIndicatorsLatestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsTopicsIndicatorsLatestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsTopicsIndicatorsLatestExample.valid(),
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
