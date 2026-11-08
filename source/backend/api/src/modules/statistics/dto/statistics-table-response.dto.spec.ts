import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StatisticsTableResponseDto } from "#/modules/statistics/dto/statistics-table-response.dto.ts";
import { statisticsTableResponseExample } from "#/modules/statistics/dto/statistics-table-response.dto.example.ts";

/** Managed by Dryv: StatisticsTableResponseDto enforces exactly what the StatisticsTableResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StatisticsTableResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = statisticsTableResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StatisticsTableResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(statisticsTableResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...statisticsTableResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});