import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsBreakdownsCommunityDto } from "#/modules/insights/schema/dto/place-statistics-breakdowns-community.dto.ts";
import { placeStatisticsBreakdownsCommunityExample } from "@test/modules/insights/schema/dto/examples/place-statistics-breakdowns-community.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsBreakdownsCommunityDto enforces exactly what the PlaceStatisticsBreakdownsCommunity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsBreakdownsCommunityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsBreakdownsCommunityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsBreakdownsCommunityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsBreakdownsCommunityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsBreakdownsCommunityExample.valid(),
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
