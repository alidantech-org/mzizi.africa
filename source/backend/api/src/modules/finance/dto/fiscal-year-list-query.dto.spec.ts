import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalYearListQueryDto } from "#/modules/finance/dto/fiscal-year-list-query.dto.ts";
import { fiscalYearListQueryExample } from "#/modules/finance/dto/fiscal-year-list-query.dto.example.ts";

/** Managed by Dryv: FiscalYearListQueryDto enforces exactly what the FiscalYearListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalYearListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalYearListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalYearListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalYearListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalYearListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});