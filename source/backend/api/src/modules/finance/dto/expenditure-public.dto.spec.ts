import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExpenditurePublicDto } from "#/modules/finance/dto/expenditure-public.dto.ts";
import { expenditurePublicExample } from "#/modules/finance/dto/expenditure-public.dto.example.ts";

/** Managed by Dryv: ExpenditurePublicDto enforces exactly what the ExpenditurePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExpenditurePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = expenditurePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExpenditurePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(expenditurePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...expenditurePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});