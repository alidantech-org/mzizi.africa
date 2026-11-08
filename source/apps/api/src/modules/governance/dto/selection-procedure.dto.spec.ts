import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionProcedureDto } from "#/modules/governance/dto/selection-procedure.dto.ts";
import { selectionProcedureExample } from "#/modules/governance/dto/selection-procedure.dto.example.ts";

/** Managed by Dryv: SelectionProcedureDto enforces exactly what the SelectionProcedure contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionProcedureDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionProcedureExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionProcedureDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionProcedureExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionProcedureExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});