import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeRailRefsDto } from "#/modules/insights/schema/dto/governance-tree-rail-refs.dto.ts";
import { governanceTreeRailRefsExample } from "@test/modules/insights/schema/dto/examples/governance-tree-rail-refs.dto.example.ts";

/** Managed by Dryv: GovernanceTreeRailRefsDto enforces exactly what the GovernanceTreeRailRefs contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeRailRefsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeRailRefsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeRailRefsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeRailRefsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeRailRefsExample.valid(),
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
