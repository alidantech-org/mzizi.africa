import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GovernanceTreeDto } from "#/modules/insights/schema/dto/governance-tree.dto.ts";
import { governanceTreeExample } from "@test/modules/insights/schema/dto/examples/governance-tree.dto.example.ts";

/** Managed by Dryv: GovernanceTreeDto enforces exactly what the GovernanceTree contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GovernanceTreeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = governanceTreeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GovernanceTreeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(governanceTreeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...governanceTreeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
