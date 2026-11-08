import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeriodListQueryDto } from "#/modules/statistics/dto/period-list-query.dto.ts";
import { periodListQueryExample } from "#/modules/statistics/dto/period-list-query.dto.example.ts";

/** Managed by Dryv: PeriodListQueryDto enforces exactly what the PeriodListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeriodListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = periodListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PeriodListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(periodListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...periodListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});