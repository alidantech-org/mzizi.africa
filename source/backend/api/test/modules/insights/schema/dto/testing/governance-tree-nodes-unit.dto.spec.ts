import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeNodesUnitDto } from "#/modules/insights/schema/dto/governance-tree-nodes-unit.dto.ts";
import { governanceTreeNodesUnitExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-unit.dto.example.ts";

/** Managed by Dryv: GovernanceTreeNodesUnitDto enforces exactly what the GovernanceTreeNodesUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeNodesUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeNodesUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeNodesUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeNodesUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeNodesUnitExample.valid(),
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
