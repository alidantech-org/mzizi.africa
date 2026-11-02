import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionProcedurePublicDto } from "#/modules/governance/dto/selection-procedure-public.dto.ts";
import { selectionProcedurePublicExample } from "#/modules/governance/dto/selection-procedure-public.dto.example.ts";

/** Managed by Dryv: SelectionProcedurePublicDto enforces exactly what the SelectionProcedurePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionProcedurePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionProcedurePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionProcedurePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionProcedurePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionProcedurePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});