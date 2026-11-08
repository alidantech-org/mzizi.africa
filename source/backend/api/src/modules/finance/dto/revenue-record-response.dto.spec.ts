import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RevenueRecordResponseDto } from "#/modules/finance/dto/revenue-record-response.dto.ts";
import { revenueRecordResponseExample } from "#/modules/finance/dto/revenue-record-response.dto.example.ts";

/** Managed by Dryv: RevenueRecordResponseDto enforces exactly what the RevenueRecordResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RevenueRecordResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = revenueRecordResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RevenueRecordResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(revenueRecordResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...revenueRecordResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});