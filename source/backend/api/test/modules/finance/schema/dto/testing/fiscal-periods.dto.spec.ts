import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FiscalPeriodsDto } from "#/modules/finance/schema/dto/fiscal-periods.dto.ts";
import { fiscalPeriodsExample } from "@test/modules/finance/schema/dto/examples/fiscal-periods.dto.example.ts";

/** Managed by Dryv: FiscalPeriodsDto enforces exactly what the FiscalPeriods contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FiscalPeriodsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = fiscalPeriodsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FiscalPeriodsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(fiscalPeriodsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...fiscalPeriodsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
