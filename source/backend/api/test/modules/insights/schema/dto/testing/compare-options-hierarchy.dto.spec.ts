import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsHierarchyDto } from "#/modules/insights/schema/dto/compare-options-hierarchy.dto.ts";
import { compareOptionsHierarchyExample } from "@test/modules/insights/schema/dto/examples/compare-options-hierarchy.dto.example.ts";

/** Managed by Dryv: CompareOptionsHierarchyDto enforces exactly what the CompareOptionsHierarchy contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsHierarchyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsHierarchyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsHierarchyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsHierarchyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsHierarchyExample.valid(),
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
