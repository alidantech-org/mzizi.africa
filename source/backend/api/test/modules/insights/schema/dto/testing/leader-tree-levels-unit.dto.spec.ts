import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderTreeLevelsUnitDto } from "#/modules/insights/schema/dto/leader-tree-levels-unit.dto.ts";
import { leaderTreeLevelsUnitExample } from "@test/modules/insights/schema/dto/examples/leader-tree-levels-unit.dto.example.ts";

/** Managed by Dryv: LeaderTreeLevelsUnitDto enforces exactly what the LeaderTreeLevelsUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderTreeLevelsUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderTreeLevelsUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderTreeLevelsUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderTreeLevelsUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderTreeLevelsUnitExample.valid(),
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
