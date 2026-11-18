import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderboardMetricListDto } from "#/modules/insights/schema/dto/leaderboard-metric-list.dto.ts";
import { leaderboardMetricListExample } from "@test/modules/insights/schema/dto/examples/leaderboard-metric-list.dto.example.ts";

/** Managed by Dryv: LeaderboardMetricListDto enforces exactly what the LeaderboardMetricList contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderboardMetricListDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderboardMetricListExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderboardMetricListDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderboardMetricListExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderboardMetricListExample.valid(),
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
