import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StatisticsTableListQueryDto } from "#/modules/statistics/dto/statistics-table-list-query.dto.ts";
import { statisticsTableListQueryExample } from "#/modules/statistics/dto/statistics-table-list-query.dto.example.ts";

/** Managed by Dryv: StatisticsTableListQueryDto enforces exactly what the StatisticsTableListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StatisticsTableListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = statisticsTableListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StatisticsTableListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(statisticsTableListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...statisticsTableListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});