import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TreeInputDto } from "#/modules/insights/schema/dto/tree-input.dto.ts";
import { treeInputExample } from "@test/modules/insights/schema/dto/examples/tree-input.dto.example.ts";

/** Managed by Dryv: TreeInputDto enforces exactly what the TreeInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TreeInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = treeInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TreeInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(treeInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...treeInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
