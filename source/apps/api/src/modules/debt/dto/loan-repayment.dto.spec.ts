import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanRepaymentDto } from "#/modules/debt/dto/loan-repayment.dto.ts";
import { loanRepaymentExample } from "#/modules/debt/dto/loan-repayment.dto.example.ts";

/** Managed by Dryv: LoanRepaymentDto enforces exactly what the LoanRepayment contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanRepaymentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanRepaymentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanRepaymentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanRepaymentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanRepaymentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});