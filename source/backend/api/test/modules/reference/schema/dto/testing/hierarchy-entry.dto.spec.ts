import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HierarchyEntryDto } from "#/modules/reference/schema/dto/hierarchy-entry.dto.ts";
import { hierarchyEntryExample } from "@test/modules/reference/schema/dto/examples/hierarchy-entry.dto.example.ts";

/** Managed by Dryv: HierarchyEntryDto enforces exactly what the HierarchyEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HierarchyEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hierarchyEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HierarchyEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hierarchyEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...hierarchyEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
