import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsTopicsDto } from "#/modules/insights/schema/dto/place-statistics-topics.dto.ts";
import { placeStatisticsTopicsExample } from "@test/modules/insights/schema/dto/examples/place-statistics-topics.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsTopicsDto enforces exactly what the PlaceStatisticsTopics contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsTopicsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsTopicsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsTopicsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsTopicsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsTopicsExample.valid(),
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
