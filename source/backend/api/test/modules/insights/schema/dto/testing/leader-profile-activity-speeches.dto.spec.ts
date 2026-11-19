import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileActivitySpeechesDto } from "#/modules/insights/schema/dto/leader-profile-activity-speeches.dto.ts";
import { leaderProfileActivitySpeechesExample } from "@test/modules/insights/schema/dto/examples/leader-profile-activity-speeches.dto.example.ts";

/** Managed by Dryv: LeaderProfileActivitySpeechesDto enforces exactly what the LeaderProfileActivitySpeeches contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileActivitySpeechesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileActivitySpeechesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileActivitySpeechesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileActivitySpeechesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileActivitySpeechesExample.valid(),
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
