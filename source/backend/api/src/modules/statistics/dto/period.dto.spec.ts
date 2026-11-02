import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeriodDto } from "#/modules/statistics/dto/period.dto.ts";
import { periodExample } from "#/modules/statistics/dto/period.dto.example.ts";

/** Managed by Dryv: PeriodDto enforces exactly what the Period contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeriodDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = periodExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PeriodDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(periodExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...periodExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});