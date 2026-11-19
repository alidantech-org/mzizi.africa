import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderTreeLevelsDto } from "#/modules/insights/schema/dto/leader-tree-levels.dto.ts";
import { leaderTreeLevelsExample } from "@test/modules/insights/schema/dto/examples/leader-tree-levels.dto.example.ts";

/** Managed by Dryv: LeaderTreeLevelsDto enforces exactly what the LeaderTreeLevels contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderTreeLevelsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderTreeLevelsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderTreeLevelsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderTreeLevelsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderTreeLevelsExample.valid(),
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
