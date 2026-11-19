import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeNodesBodyDto } from "#/modules/insights/schema/dto/governance-tree-nodes-body.dto.ts";
import { governanceTreeNodesBodyExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-body.dto.example.ts";

/** Managed by Dryv: GovernanceTreeNodesBodyDto enforces exactly what the GovernanceTreeNodesBody contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeNodesBodyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeNodesBodyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeNodesBodyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeNodesBodyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeNodesBodyExample.valid(),
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
