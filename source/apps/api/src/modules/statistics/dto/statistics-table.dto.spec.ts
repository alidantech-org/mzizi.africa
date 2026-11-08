import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StatisticsTableDto } from "#/modules/statistics/dto/statistics-table.dto.ts";
import { statisticsTableExample } from "#/modules/statistics/dto/statistics-table.dto.example.ts";

/** Managed by Dryv: StatisticsTableDto enforces exactly what the StatisticsTable contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StatisticsTableDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = statisticsTableExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StatisticsTableDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(statisticsTableExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...statisticsTableExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});