import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionStageListQueryDto } from "#/modules/governance/dto/selection-stage-list-query.dto.ts";
import { selectionStageListQueryExample } from "#/modules/governance/dto/selection-stage-list-query.dto.example.ts";

/** Managed by Dryv: SelectionStageListQueryDto enforces exactly what the SelectionStageListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionStageListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionStageListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionStageListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionStageListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionStageListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});