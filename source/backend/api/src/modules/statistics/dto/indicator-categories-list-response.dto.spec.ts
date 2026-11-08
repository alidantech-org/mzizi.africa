import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorCategoriesListResponseDto } from "#/modules/statistics/dto/indicator-categories-list-response.dto.ts";
import { indicatorCategoriesListResponseExample } from "#/modules/statistics/dto/indicator-categories-list-response.dto.example.ts";

/** Managed by Dryv: IndicatorCategoriesListResponseDto enforces exactly what the IndicatorCategoriesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorCategoriesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorCategoriesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorCategoriesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorCategoriesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorCategoriesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});