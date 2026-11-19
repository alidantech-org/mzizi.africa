import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileActivityContributionsDto } from "#/modules/insights/schema/dto/leader-profile-activity-contributions.dto.ts";
import { leaderProfileActivityContributionsExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-contributions.dto.example.ts";

/** Managed by Dryv: LeaderProfileActivityContributionsDto enforces exactly what the LeaderProfileActivityContributions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileActivityContributionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileActivityContributionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileActivityContributionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileActivityContributionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileActivityContributionsExample.valid(),
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
