import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HierarchyCollectionDto } from "#/modules/reference/schema/dto/hierarchy-collection.dto.ts";
import { hierarchyCollectionExample } from "@test/modules/reference/schema/dto/examples/hierarchy-collection.dto.example.ts";

/** Managed by Dryv: HierarchyCollectionDto enforces exactly what the HierarchyCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HierarchyCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = hierarchyCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HierarchyCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(hierarchyCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...hierarchyCollectionExample.valid(),
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
