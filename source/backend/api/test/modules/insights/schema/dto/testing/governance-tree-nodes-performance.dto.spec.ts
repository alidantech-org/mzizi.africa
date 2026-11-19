import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeNodesPerformanceDto } from "#/modules/insights/schema/dto/governance-tree-nodes-performance.dto.ts";
import { governanceTreeNodesPerformanceExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-performance.dto.example.ts";

/** Managed by Dryv: GovernanceTreeNodesPerformanceDto enforces exactly what the GovernanceTreeNodesPerformance contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeNodesPerformanceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeNodesPerformanceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeNodesPerformanceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeNodesPerformanceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeNodesPerformanceExample.valid(),
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
