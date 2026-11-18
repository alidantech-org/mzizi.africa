import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto.ts";
import { placeStatisticsExample } from "@test/modules/insights/schema/dto/examples/place-statistics.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsDto enforces exactly what the PlaceStatistics contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsExample.valid(),
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
