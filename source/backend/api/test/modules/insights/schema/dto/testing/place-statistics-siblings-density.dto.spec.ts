import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsSiblingsDensityDto } from "#/modules/insights/schema/dto/place-statistics-siblings-density.dto.ts";
import { placeStatisticsSiblingsDensityExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings-density.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsSiblingsDensityDto enforces exactly what the PlaceStatisticsSiblingsDensity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsSiblingsDensityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsSiblingsDensityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsSiblingsDensityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsSiblingsDensityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsSiblingsDensityExample.valid(),
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
