import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileElectionDto } from "#/modules/insights/schema/dto/leader-profile-election.dto.ts";
import { leaderProfileElectionExample } from "@test/modules/insights/schema/dto/examples/leader-profile-election.dto.example.ts";

/** Managed by Dryv: LeaderProfileElectionDto enforces exactly what the LeaderProfileElection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileElectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileElectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileElectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileElectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileElectionExample.valid(),
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
