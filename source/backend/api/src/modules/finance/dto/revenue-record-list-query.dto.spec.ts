import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RevenueRecordListQueryDto } from "#/modules/finance/dto/revenue-record-list-query.dto.ts";
import { revenueRecordListQueryExample } from "#/modules/finance/dto/revenue-record-list-query.dto.example.ts";

/** Managed by Dryv: RevenueRecordListQueryDto enforces exactly what the RevenueRecordListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RevenueRecordListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = revenueRecordListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RevenueRecordListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(revenueRecordListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...revenueRecordListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});