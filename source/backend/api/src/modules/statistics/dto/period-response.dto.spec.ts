import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeriodResponseDto } from "#/modules/statistics/dto/period-response.dto.ts";
import { periodResponseExample } from "#/modules/statistics/dto/period-response.dto.example.ts";

/** Managed by Dryv: PeriodResponseDto enforces exactly what the PeriodResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeriodResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = periodResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PeriodResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(periodResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...periodResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});