import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileActivityVotesDto } from "#/modules/insights/schema/dto/leader-profile-activity-votes.dto.ts";
import { leaderProfileActivityVotesExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-votes.dto.example.ts";

/** Managed by Dryv: LeaderProfileActivityVotesDto enforces exactly what the LeaderProfileActivityVotes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileActivityVotesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileActivityVotesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileActivityVotesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileActivityVotesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileActivityVotesExample.valid(),
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
