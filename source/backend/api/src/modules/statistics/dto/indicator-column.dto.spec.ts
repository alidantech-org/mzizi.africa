import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { IndicatorColumnDto } from "#/modules/statistics/dto/indicator-column.dto.ts";
import { indicatorColumnExample } from "#/modules/statistics/dto/indicator-column.dto.example.ts";

/** Managed by Dryv: IndicatorColumnDto enforces exactly what the IndicatorColumn contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(IndicatorColumnDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = indicatorColumnExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("IndicatorColumnDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(indicatorColumnExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...indicatorColumnExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});