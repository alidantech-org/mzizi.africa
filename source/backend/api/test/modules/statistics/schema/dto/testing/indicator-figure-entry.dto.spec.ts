import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorFigureEntryDto } from "#/modules/statistics/schema/dto/indicator-figure-entry.dto.ts";
import { indicatorFigureEntryExample } from "@test/modules/statistics/schema/dto/examples/indicator-figure-entry.dto.example.ts";

/** Managed by Dryv: IndicatorFigureEntryDto enforces exactly what the IndicatorFigureEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorFigureEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorFigureEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorFigureEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorFigureEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...indicatorFigureEntryExample.valid(),
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
