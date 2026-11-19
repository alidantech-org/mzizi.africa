import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailContestsDto } from "#/modules/insights/schema/dto/election-detail-contests.dto.ts";
import { electionDetailContestsExample } from "@test/modules/insights/schema/dto/examples/election-detail-contests.dto.example.ts";

/** Managed by Dryv: ElectionDetailContestsDto enforces exactly what the ElectionDetailContests contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailContestsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailContestsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailContestsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailContestsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailContestsExample.valid(),
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
