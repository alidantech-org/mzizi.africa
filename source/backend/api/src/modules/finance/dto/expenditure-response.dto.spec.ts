import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExpenditureResponseDto } from "#/modules/finance/dto/expenditure-response.dto.ts";
import { expenditureResponseExample } from "#/modules/finance/dto/expenditure-response.dto.example.ts";

/** Managed by Dryv: ExpenditureResponseDto enforces exactly what the ExpenditureResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExpenditureResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = expenditureResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExpenditureResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(expenditureResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...expenditureResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});