import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailContestsCandidatesDto } from "#/modules/election/schema/dto/election-detail-contests-candidates.dto.ts";
import { electionDetailContestsCandidatesExample } from "@test/modules/election/schema/dto/examples/election-detail-contests-candidates.dto.example.ts";

/** Managed by Dryv: ElectionDetailContestsCandidatesDto enforces exactly what the ElectionDetailContestsCandidates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailContestsCandidatesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailContestsCandidatesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailContestsCandidatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailContestsCandidatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailContestsCandidatesExample.valid(),
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
