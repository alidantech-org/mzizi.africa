import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionStagesListResponseDto } from "#/modules/governance/dto/selection-stages-list-response.dto.ts";
import { selectionStagesListResponseExample } from "#/modules/governance/dto/selection-stages-list-response.dto.example.ts";

/** Managed by Dryv: SelectionStagesListResponseDto enforces exactly what the SelectionStagesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionStagesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionStagesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionStagesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionStagesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionStagesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});