import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LeaderProfileEvidenceDto } from "#/modules/insights/schema/dto/leader-profile-evidence.dto.ts";
import { leaderProfileEvidenceExample } from "@test/modules/insights/schema/dto/examples/leader-profile-evidence.dto.example.ts";

/** Managed by Dryv: LeaderProfileEvidenceDto enforces exactly what the LeaderProfileEvidence contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LeaderProfileEvidenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = leaderProfileEvidenceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LeaderProfileEvidenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(leaderProfileEvidenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...leaderProfileEvidenceExample.valid(),
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
