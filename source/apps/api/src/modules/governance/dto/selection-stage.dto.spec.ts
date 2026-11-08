import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionStageDto } from "#/modules/governance/dto/selection-stage.dto.ts";
import { selectionStageExample } from "#/modules/governance/dto/selection-stage.dto.example.ts";

/** Managed by Dryv: SelectionStageDto enforces exactly what the SelectionStage contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionStageDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionStageExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionStageDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionStageExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionStageExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});