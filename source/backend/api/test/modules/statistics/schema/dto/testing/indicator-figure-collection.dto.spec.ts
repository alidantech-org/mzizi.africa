import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorFigureCollectionDto } from "#/modules/statistics/schema/dto/indicator-figure-collection.dto.ts";
import { indicatorFigureCollectionExample } from "@test/modules/statistics/schema/dto/examples/indicator-figure-collection.dto.example.ts";

/** Managed by Dryv: IndicatorFigureCollectionDto enforces exactly what the IndicatorFigureCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorFigureCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorFigureCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorFigureCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorFigureCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorFigureCollectionExample.valid(),
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
