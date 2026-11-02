import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorColumnsListResponseDto } from "#/modules/statistics/dto/indicator-columns-list-response.dto.ts";
import { indicatorColumnsListResponseExample } from "#/modules/statistics/dto/indicator-columns-list-response.dto.example.ts";

/** Managed by Dryv: IndicatorColumnsListResponseDto enforces exactly what the IndicatorColumnsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorColumnsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorColumnsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorColumnsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorColumnsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorColumnsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});