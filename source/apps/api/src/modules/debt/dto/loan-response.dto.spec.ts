import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LoanResponseDto } from "#/modules/debt/dto/loan-response.dto.ts";
import { loanResponseExample } from "#/modules/debt/dto/loan-response.dto.example.ts";

/** Managed by Dryv: LoanResponseDto enforces exactly what the LoanResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LoanResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = loanResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LoanResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(loanResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...loanResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});