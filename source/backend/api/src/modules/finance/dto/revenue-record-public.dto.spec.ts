import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { RevenueRecordPublicDto } from "#/modules/finance/dto/revenue-record-public.dto.ts";
import { revenueRecordPublicExample } from "#/modules/finance/dto/revenue-record-public.dto.example.ts";

/** Managed by Dryv: RevenueRecordPublicDto enforces exactly what the RevenueRecordPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(RevenueRecordPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = revenueRecordPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("RevenueRecordPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(revenueRecordPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...revenueRecordPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});