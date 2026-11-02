import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanDisbursementsListResponseDto } from "#/modules/debt/dto/loan-disbursements-list-response.dto.ts";
import { loanDisbursementsListResponseExample } from "#/modules/debt/dto/loan-disbursements-list-response.dto.example.ts";

/** Managed by Dryv: LoanDisbursementsListResponseDto enforces exactly what the LoanDisbursementsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanDisbursementsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanDisbursementsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanDisbursementsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanDisbursementsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanDisbursementsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});