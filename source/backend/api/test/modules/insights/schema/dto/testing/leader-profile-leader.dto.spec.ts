import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileLeaderDto } from "#/modules/insights/schema/dto/leader-profile-leader.dto.ts";
import { leaderProfileLeaderExample } from "@test/modules/insights/schema/dto/examples/leader-profile-leader.dto.example.ts";

/** Managed by Dryv: LeaderProfileLeaderDto enforces exactly what the LeaderProfileLeader contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileLeaderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileLeaderExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileLeaderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileLeaderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileLeaderExample.valid(),
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
