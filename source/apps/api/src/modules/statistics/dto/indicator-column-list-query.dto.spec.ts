import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorColumnListQueryDto } from "#/modules/statistics/dto/indicator-column-list-query.dto.ts";
import { indicatorColumnListQueryExample } from "#/modules/statistics/dto/indicator-column-list-query.dto.example.ts";

/** Managed by Dryv: IndicatorColumnListQueryDto enforces exactly what the IndicatorColumnListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorColumnListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorColumnListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorColumnListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorColumnListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorColumnListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});