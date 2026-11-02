import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ExpenditureListQueryDto } from "#/modules/finance/dto/expenditure-list-query.dto.ts";
import { expenditureListQueryExample } from "#/modules/finance/dto/expenditure-list-query.dto.example.ts";

/** Managed by Dryv: ExpenditureListQueryDto enforces exactly what the ExpenditureListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ExpenditureListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = expenditureListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ExpenditureListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(expenditureListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...expenditureListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});