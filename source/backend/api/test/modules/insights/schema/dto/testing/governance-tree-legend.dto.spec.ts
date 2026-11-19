import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeLegendDto } from "#/modules/insights/schema/dto/governance-tree-legend.dto.ts";
import { governanceTreeLegendExample } from "@test/modules/insights/schema/dto/examples/governance-tree-legend.dto.example.ts";

/** Managed by Dryv: GovernanceTreeLegendDto enforces exactly what the GovernanceTreeLegend contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeLegendDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeLegendExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeLegendDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeLegendExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeLegendExample.valid(),
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
