import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalYearDto } from "#/modules/finance/dto/fiscal-year.dto.ts";
import { fiscalYearExample } from "#/modules/finance/dto/fiscal-year.dto.example.ts";

/** Managed by Dryv: FiscalYearDto enforces exactly what the FiscalYear contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalYearDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalYearExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalYearDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalYearExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalYearExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});