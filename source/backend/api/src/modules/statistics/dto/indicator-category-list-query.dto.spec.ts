import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorCategoryListQueryDto } from "#/modules/statistics/dto/indicator-category-list-query.dto.ts";
import { indicatorCategoryListQueryExample } from "#/modules/statistics/dto/indicator-category-list-query.dto.example.ts";

/** Managed by Dryv: IndicatorCategoryListQueryDto enforces exactly what the IndicatorCategoryListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorCategoryListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorCategoryListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorCategoryListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorCategoryListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorCategoryListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});