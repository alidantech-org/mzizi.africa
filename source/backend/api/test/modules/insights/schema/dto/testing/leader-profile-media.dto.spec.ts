import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileMediaDto } from "#/modules/insights/schema/dto/leader-profile-media.dto.ts";
import { leaderProfileMediaExample } from "@test/modules/insights/schema/dto/examples/leader-profile-media.dto.example.ts";

/** Managed by Dryv: LeaderProfileMediaDto enforces exactly what the LeaderProfileMedia contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileMediaDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileMediaExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileMediaDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileMediaExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileMediaExample.valid(),
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
