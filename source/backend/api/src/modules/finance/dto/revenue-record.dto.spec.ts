import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RevenueRecordDto } from "#/modules/finance/dto/revenue-record.dto.ts";
import { revenueRecordExample } from "#/modules/finance/dto/revenue-record.dto.example.ts";

/** Managed by Dryv: RevenueRecordDto enforces exactly what the RevenueRecord contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RevenueRecordDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = revenueRecordExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RevenueRecordDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(revenueRecordExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...revenueRecordExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});