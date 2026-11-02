import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorResponseDto } from "#/modules/statistics/dto/indicator-response.dto.ts";
import { indicatorResponseExample } from "#/modules/statistics/dto/indicator-response.dto.example.ts";

/** Managed by Dryv: IndicatorResponseDto enforces exactly what the IndicatorResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});