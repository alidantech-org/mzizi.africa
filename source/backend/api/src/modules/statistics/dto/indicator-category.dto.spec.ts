import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorCategoryDto } from "#/modules/statistics/dto/indicator-category.dto.ts";
import { indicatorCategoryExample } from "#/modules/statistics/dto/indicator-category.dto.example.ts";

/** Managed by Dryv: IndicatorCategoryDto enforces exactly what the IndicatorCategory contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorCategoryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorCategoryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorCategoryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorCategoryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorCategoryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});