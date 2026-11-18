import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileDto } from "#/modules/insights/schema/dto/leader-profile.dto.ts";
import { leaderProfileExample } from "@test/modules/insights/schema/dto/examples/leader-profile.dto.example.ts";

/** Managed by Dryv: LeaderProfileDto enforces exactly what the LeaderProfile contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...leaderProfileExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
