import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionProceduresListResponseDto } from "#/modules/governance/dto/selection-procedures-list-response.dto.ts";
import { selectionProceduresListResponseExample } from "#/modules/governance/dto/selection-procedures-list-response.dto.example.ts";

/** Managed by Dryv: SelectionProceduresListResponseDto enforces exactly what the SelectionProceduresListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionProceduresListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionProceduresListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionProceduresListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionProceduresListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionProceduresListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});