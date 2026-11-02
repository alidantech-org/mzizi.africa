import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorCategoryPublicDto } from "#/modules/statistics/dto/indicator-category-public.dto.ts";
import { indicatorCategoryPublicExample } from "#/modules/statistics/dto/indicator-category-public.dto.example.ts";

/** Managed by Dryv: IndicatorCategoryPublicDto enforces exactly what the IndicatorCategoryPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorCategoryPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorCategoryPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorCategoryPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorCategoryPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorCategoryPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});