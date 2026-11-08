import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorsListResponseDto } from "#/modules/statistics/dto/indicators-list-response.dto.ts";
import { indicatorsListResponseExample } from "#/modules/statistics/dto/indicators-list-response.dto.example.ts";

/** Managed by Dryv: IndicatorsListResponseDto enforces exactly what the IndicatorsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});