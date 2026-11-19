import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTabsTabsDto } from "#/modules/insights/schema/dto/governance-tabs-tabs.dto.ts";
import { governanceTabsTabsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-tabs.dto.example.ts";

/** Managed by Dryv: GovernanceTabsTabsDto enforces exactly what the GovernanceTabsTabs contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTabsTabsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTabsTabsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTabsTabsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTabsTabsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTabsTabsExample.valid(),
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
