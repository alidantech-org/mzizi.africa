import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsBreakdownsAgeDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-age.dto.ts";
import { placeStatisticsBreakdownsAgeExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-age.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsBreakdownsAgeDto enforces exactly what the PlaceStatisticsBreakdownsAge contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsBreakdownsAgeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsBreakdownsAgeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsBreakdownsAgeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsBreakdownsAgeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsBreakdownsAgeExample.valid(),
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
