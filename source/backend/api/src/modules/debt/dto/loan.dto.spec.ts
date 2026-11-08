import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanDto } from "#/modules/debt/dto/loan.dto.ts";
import { loanExample } from "#/modules/debt/dto/loan.dto.example.ts";

/** Managed by Dryv: LoanDto enforces exactly what the Loan contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});