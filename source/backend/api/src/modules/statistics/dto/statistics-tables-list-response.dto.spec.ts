import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StatisticsTablesListResponseDto } from "#/modules/statistics/dto/statistics-tables-list-response.dto.ts";
import { statisticsTablesListResponseExample } from "#/modules/statistics/dto/statistics-tables-list-response.dto.example.ts";

/** Managed by Dryv: StatisticsTablesListResponseDto enforces exactly what the StatisticsTablesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StatisticsTablesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = statisticsTablesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StatisticsTablesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(statisticsTablesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...statisticsTablesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});