import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailContestsCandidatesNamesDto } from "#/modules/election/schema/dto/election-detail-contests-candidates-names.dto.ts";
import { electionDetailContestsCandidatesNamesExample } from "@test/modules/election/schema/dto/examples/election-detail-contests-candidates-names.dto.example.ts";

/** Managed by Dryv: ElectionDetailContestsCandidatesNamesDto enforces exactly what the ElectionDetailContestsCandidatesNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailContestsCandidatesNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailContestsCandidatesNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailContestsCandidatesNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailContestsCandidatesNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailContestsCandidatesNamesExample.valid(),
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
