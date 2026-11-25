import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HierarchyEntryLevelsNamesDto } from "#/modules/reference/schema/dto/hierarchy-entry-levels-names.dto.ts";
import { hierarchyEntryLevelsNamesExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry-levels-names.dto.example.ts";

/** Managed by Dryv: HierarchyEntryLevelsNamesDto enforces exactly what the HierarchyEntryLevelsNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HierarchyEntryLevelsNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hierarchyEntryLevelsNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HierarchyEntryLevelsNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hierarchyEntryLevelsNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...hierarchyEntryLevelsNamesExample.valid(),
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
