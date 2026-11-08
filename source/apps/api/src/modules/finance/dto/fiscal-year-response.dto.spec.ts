import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalYearResponseDto } from "#/modules/finance/dto/fiscal-year-response.dto.ts";
import { fiscalYearResponseExample } from "#/modules/finance/dto/fiscal-year-response.dto.example.ts";

/** Managed by Dryv: FiscalYearResponseDto enforces exactly what the FiscalYearResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalYearResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalYearResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalYearResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalYearResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalYearResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});