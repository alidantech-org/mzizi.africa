import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsComparisonsDto } from "#/modules/insights/schema/dto/place-statistics-comparisons.dto.ts";
import { placeStatisticsComparisonsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-comparisons.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsComparisonsDto enforces exactly what the PlaceStatisticsComparisons contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsComparisonsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsComparisonsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsComparisonsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsComparisonsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsComparisonsExample.valid(),
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
