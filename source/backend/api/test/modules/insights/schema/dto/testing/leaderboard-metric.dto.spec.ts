import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderboardMetricDto } from "#/modules/insights/schema/dto/leaderboard-metric.dto.ts";
import { leaderboardMetricExample } from "@test/modules/insights/schema/dto/examples/leaderboard-metric.dto.example.ts";

/** Managed by Dryv: LeaderboardMetricDto enforces exactly what the LeaderboardMetric contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderboardMetricDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderboardMetricExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderboardMetricDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderboardMetricExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderboardMetricExample.valid(),
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
