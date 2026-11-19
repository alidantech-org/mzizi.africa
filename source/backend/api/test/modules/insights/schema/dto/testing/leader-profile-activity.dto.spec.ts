import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileActivityDto } from "#/modules/insights/schema/dto/leader-profile-activity.dto.ts";
import { leaderProfileActivityExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity.dto.example.ts";

/** Managed by Dryv: LeaderProfileActivityDto enforces exactly what the LeaderProfileActivity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileActivityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileActivityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileActivityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileActivityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileActivityExample.valid(),
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
