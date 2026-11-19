import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeNodesHowDto } from "#/modules/insights/schema/dto/governance-tree-nodes-how.dto.ts";
import { governanceTreeNodesHowExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-how.dto.example.ts";

/** Managed by Dryv: GovernanceTreeNodesHowDto enforces exactly what the GovernanceTreeNodesHow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeNodesHowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeNodesHowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeNodesHowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeNodesHowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeNodesHowExample.valid(),
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
