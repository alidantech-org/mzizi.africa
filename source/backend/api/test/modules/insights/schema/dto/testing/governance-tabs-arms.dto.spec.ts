import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTabsArmsDto } from "#/modules/insights/schema/dto/governance-tabs-arms.dto.ts";
import { governanceTabsArmsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-arms.dto.example.ts";

/** Managed by Dryv: GovernanceTabsArmsDto enforces exactly what the GovernanceTabsArms contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTabsArmsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTabsArmsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTabsArmsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTabsArmsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTabsArmsExample.valid(),
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
