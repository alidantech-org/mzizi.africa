import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderboardDto } from "#/modules/insights/schema/dto/leaderboard.dto.ts";
import { leaderboardExample } from "@test/modules/insights/schema/dto/examples/leaderboard.dto.example.ts";

/** Managed by Dryv: LeaderboardDto enforces exactly what the Leaderboard contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderboardDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderboardExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderboardDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderboardExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...leaderboardExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
