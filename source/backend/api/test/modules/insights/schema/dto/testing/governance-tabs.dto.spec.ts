import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTabsDto } from "#/modules/insights/schema/dto/governance-tabs.dto.ts";
import { governanceTabsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs.dto.example.ts";

/** Managed by Dryv: GovernanceTabsDto enforces exactly what the GovernanceTabs contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTabsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTabsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTabsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTabsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...governanceTabsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
