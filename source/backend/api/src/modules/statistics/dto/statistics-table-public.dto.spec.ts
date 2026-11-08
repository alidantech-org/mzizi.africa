import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { StatisticsTablePublicDto } from "#/modules/statistics/dto/statistics-table-public.dto.ts";
import { statisticsTablePublicExample } from "#/modules/statistics/dto/statistics-table-public.dto.example.ts";

/** Managed by Dryv: StatisticsTablePublicDto enforces exactly what the StatisticsTablePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(StatisticsTablePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = statisticsTablePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("StatisticsTablePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(statisticsTablePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...statisticsTablePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});