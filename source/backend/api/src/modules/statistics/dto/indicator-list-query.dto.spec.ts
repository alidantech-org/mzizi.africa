import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorListQueryDto } from "#/modules/statistics/dto/indicator-list-query.dto.ts";
import { indicatorListQueryExample } from "#/modules/statistics/dto/indicator-list-query.dto.example.ts";

/** Managed by Dryv: IndicatorListQueryDto enforces exactly what the IndicatorListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});