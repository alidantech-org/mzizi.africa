import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeTabDto } from "#/modules/insights/schema/dto/governance-tree-tab.dto.ts";
import { governanceTreeTabExample } from "@test/modules/insights/schema/dto/examples/governance-tree-tab.dto.example.ts";

/** Managed by Dryv: GovernanceTreeTabDto enforces exactly what the GovernanceTreeTab contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeTabDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeTabExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeTabDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeTabExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...governanceTreeTabExample.valid(),
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
