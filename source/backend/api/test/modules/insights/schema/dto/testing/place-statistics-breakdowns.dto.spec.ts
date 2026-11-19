import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsBreakdownsDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns.dto.ts";
import { placeStatisticsBreakdownsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsBreakdownsDto enforces exactly what the PlaceStatisticsBreakdowns contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsBreakdownsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsBreakdownsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsBreakdownsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsBreakdownsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsBreakdownsExample.valid(),
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
