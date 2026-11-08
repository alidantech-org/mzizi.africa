import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalYearsListResponseDto } from "#/modules/finance/dto/fiscal-years-list-response.dto.ts";
import { fiscalYearsListResponseExample } from "#/modules/finance/dto/fiscal-years-list-response.dto.example.ts";

/** Managed by Dryv: FiscalYearsListResponseDto enforces exactly what the FiscalYearsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalYearsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalYearsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalYearsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalYearsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalYearsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});