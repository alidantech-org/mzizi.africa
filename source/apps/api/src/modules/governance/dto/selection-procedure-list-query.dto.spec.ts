import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionProcedureListQueryDto } from "#/modules/governance/dto/selection-procedure-list-query.dto.ts";
import { selectionProcedureListQueryExample } from "#/modules/governance/dto/selection-procedure-list-query.dto.example.ts";

/** Managed by Dryv: SelectionProcedureListQueryDto enforces exactly what the SelectionProcedureListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionProcedureListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionProcedureListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionProcedureListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionProcedureListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionProcedureListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});