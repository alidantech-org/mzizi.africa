import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeriodPublicDto } from "#/modules/statistics/dto/period-public.dto.ts";
import { periodPublicExample } from "#/modules/statistics/dto/period-public.dto.example.ts";

/** Managed by Dryv: PeriodPublicDto enforces exactly what the PeriodPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeriodPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = periodPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PeriodPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(periodPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...periodPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});