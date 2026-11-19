import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailElectionDto } from "#/modules/insights/schema/dto/election-detail-election.dto.ts";
import { electionDetailElectionExample } from "@test/modules/insights/schema/dto/examples/election-detail-election.dto.example.ts";

/** Managed by Dryv: ElectionDetailElectionDto enforces exactly what the ElectionDetailElection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailElectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailElectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailElectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailElectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailElectionExample.valid(),
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
