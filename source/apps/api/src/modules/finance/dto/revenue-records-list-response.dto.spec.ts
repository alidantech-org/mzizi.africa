import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RevenueRecordsListResponseDto } from "#/modules/finance/dto/revenue-records-list-response.dto.ts";
import { revenueRecordsListResponseExample } from "#/modules/finance/dto/revenue-records-list-response.dto.example.ts";

/** Managed by Dryv: RevenueRecordsListResponseDto enforces exactly what the RevenueRecordsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RevenueRecordsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = revenueRecordsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RevenueRecordsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(revenueRecordsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...revenueRecordsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});