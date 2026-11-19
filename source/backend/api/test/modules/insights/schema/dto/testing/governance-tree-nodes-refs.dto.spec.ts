import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeNodesRefsDto } from "#/modules/insights/schema/dto/governance-tree-nodes-refs.dto.ts";
import { governanceTreeNodesRefsExample } from "@test/modules/insights/schema/dto/examples/governance-tree-nodes-refs.dto.example.ts";

/** Managed by Dryv: GovernanceTreeNodesRefsDto enforces exactly what the GovernanceTreeNodesRefs contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeNodesRefsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeNodesRefsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeNodesRefsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeNodesRefsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeNodesRefsExample.valid(),
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
