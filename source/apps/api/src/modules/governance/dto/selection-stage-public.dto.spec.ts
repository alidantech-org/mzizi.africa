import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SelectionStagePublicDto } from "#/modules/governance/dto/selection-stage-public.dto.ts";
import { selectionStagePublicExample } from "#/modules/governance/dto/selection-stage-public.dto.example.ts";

/** Managed by Dryv: SelectionStagePublicDto enforces exactly what the SelectionStagePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SelectionStagePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = selectionStagePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SelectionStagePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(selectionStagePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...selectionStagePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});