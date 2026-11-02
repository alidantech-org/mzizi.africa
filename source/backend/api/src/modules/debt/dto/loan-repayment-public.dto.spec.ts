import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanRepaymentPublicDto } from "#/modules/debt/dto/loan-repayment-public.dto.ts";
import { loanRepaymentPublicExample } from "#/modules/debt/dto/loan-repayment-public.dto.example.ts";

/** Managed by Dryv: LoanRepaymentPublicDto enforces exactly what the LoanRepaymentPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanRepaymentPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanRepaymentPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanRepaymentPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanRepaymentPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanRepaymentPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});