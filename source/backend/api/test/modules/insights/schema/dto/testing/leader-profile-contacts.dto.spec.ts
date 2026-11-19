import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileContactsDto } from "#/modules/insights/schema/dto/leader-profile-contacts.dto.ts";
import { leaderProfileContactsExample } from "@test/modules/insights/schema/dto/examples/leader-profile-contacts.dto.example.ts";

/** Managed by Dryv: LeaderProfileContactsDto enforces exactly what the LeaderProfileContacts contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileContactsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileContactsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileContactsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileContactsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileContactsExample.valid(),
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
