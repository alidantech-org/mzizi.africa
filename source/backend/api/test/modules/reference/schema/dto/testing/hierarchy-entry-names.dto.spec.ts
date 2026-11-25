import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HierarchyEntryNamesDto } from "#/modules/reference/schema/dto/hierarchy-entry-names.dto.ts";
import { hierarchyEntryNamesExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry-names.dto.example.ts";

/** Managed by Dryv: HierarchyEntryNamesDto enforces exactly what the HierarchyEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HierarchyEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hierarchyEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HierarchyEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hierarchyEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...hierarchyEntryNamesExample.valid(),
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
