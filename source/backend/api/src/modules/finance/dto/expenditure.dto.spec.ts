import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExpenditureDto } from "#/modules/finance/dto/expenditure.dto.ts";
import { expenditureExample } from "#/modules/finance/dto/expenditure.dto.example.ts";

/** Managed by Dryv: ExpenditureDto enforces exactly what the Expenditure contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExpenditureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = expenditureExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExpenditureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(expenditureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...expenditureExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});