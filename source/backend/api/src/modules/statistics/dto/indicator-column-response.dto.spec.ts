import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorColumnResponseDto } from "#/modules/statistics/dto/indicator-column-response.dto.ts";
import { indicatorColumnResponseExample } from "#/modules/statistics/dto/indicator-column-response.dto.example.ts";

/** Managed by Dryv: IndicatorColumnResponseDto enforces exactly what the IndicatorColumnResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorColumnResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorColumnResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorColumnResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorColumnResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorColumnResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});