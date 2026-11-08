import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanDisbursementResponseDto } from "#/modules/debt/dto/loan-disbursement-response.dto.ts";
import { loanDisbursementResponseExample } from "#/modules/debt/dto/loan-disbursement-response.dto.example.ts";

/** Managed by Dryv: LoanDisbursementResponseDto enforces exactly what the LoanDisbursementResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanDisbursementResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanDisbursementResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanDisbursementResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanDisbursementResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanDisbursementResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});