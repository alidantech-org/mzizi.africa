import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderDto } from "#/modules/frontend/schema/dto/leader.dto.ts";
import { leaderExample } from "@test/modules/frontend/schema/dto/examples/leader.dto.example.ts";

/** Managed by Dryv: LeaderDto enforces exactly what the Leader contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...leaderExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
