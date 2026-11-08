import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanRepaymentsListResponseDto } from "#/modules/debt/dto/loan-repayments-list-response.dto.ts";
import { loanRepaymentsListResponseExample } from "#/modules/debt/dto/loan-repayments-list-response.dto.example.ts";

/** Managed by Dryv: LoanRepaymentsListResponseDto enforces exactly what the LoanRepaymentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanRepaymentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanRepaymentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanRepaymentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanRepaymentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanRepaymentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});