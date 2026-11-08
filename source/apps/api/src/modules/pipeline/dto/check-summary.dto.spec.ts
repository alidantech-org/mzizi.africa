import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CheckSummaryDto } from "#/modules/pipeline/dto/check-summary.dto.ts";
import { checkSummaryExample } from "#/modules/pipeline/dto/check-summary.dto.example.ts";

/** Managed by Dryv: CheckSummaryDto enforces exactly what the CheckSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CheckSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = checkSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CheckSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(checkSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...checkSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});