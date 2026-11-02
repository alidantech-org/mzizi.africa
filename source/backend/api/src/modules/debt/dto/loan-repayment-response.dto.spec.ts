import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanRepaymentResponseDto } from "#/modules/debt/dto/loan-repayment-response.dto.ts";
import { loanRepaymentResponseExample } from "#/modules/debt/dto/loan-repayment-response.dto.example.ts";

/** Managed by Dryv: LoanRepaymentResponseDto enforces exactly what the LoanRepaymentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanRepaymentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanRepaymentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanRepaymentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanRepaymentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanRepaymentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});