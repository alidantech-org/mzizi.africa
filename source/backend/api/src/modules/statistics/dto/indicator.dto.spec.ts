import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorDto } from "#/modules/statistics/dto/indicator.dto.ts";
import { indicatorExample } from "#/modules/statistics/dto/indicator.dto.example.ts";

/** Managed by Dryv: IndicatorDto enforces exactly what the Indicator contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});