import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceStatisticsSiblingsPopulationDto } from "#/modules/insights/schema/dto/place-statistics-siblings-population.dto.ts";
import { placeStatisticsSiblingsPopulationExample } from "@test/modules/insights/schema/dto/examples/place-statistics-siblings-population.dto.example.ts";

/** Managed by Dryv: PlaceStatisticsSiblingsPopulationDto enforces exactly what the PlaceStatisticsSiblingsPopulation contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceStatisticsSiblingsPopulationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeStatisticsSiblingsPopulationExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceStatisticsSiblingsPopulationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeStatisticsSiblingsPopulationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeStatisticsSiblingsPopulationExample.valid(),
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
