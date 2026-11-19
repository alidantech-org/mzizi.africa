import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsHierarchyUnitDto } from "#/modules/insights/schema/dto/compare-options-hierarchy-unit.dto.ts";
import { compareOptionsHierarchyUnitExample } from "@test/modules/insights/schema/dto/examples/compare-options-hierarchy-unit.dto.example.ts";

/** Managed by Dryv: CompareOptionsHierarchyUnitDto enforces exactly what the CompareOptionsHierarchyUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsHierarchyUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsHierarchyUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsHierarchyUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsHierarchyUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsHierarchyUnitExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
