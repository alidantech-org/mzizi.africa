import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalYearPublicDto } from "#/modules/finance/dto/fiscal-year-public.dto.ts";
import { fiscalYearPublicExample } from "#/modules/finance/dto/fiscal-year-public.dto.example.ts";

/** Managed by Dryv: FiscalYearPublicDto enforces exactly what the FiscalYearPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalYearPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalYearPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalYearPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalYearPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalYearPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});