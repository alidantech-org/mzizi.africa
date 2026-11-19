import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailUnitsCandidatesDto } from "#/modules/insights/schema/dto/election-detail-units-candidates.dto.ts";
import { electionDetailUnitsCandidatesExample } from "@test/modules/insights/schema/dto/examples/election-detail-units-candidates.dto.example.ts";

/** Managed by Dryv: ElectionDetailUnitsCandidatesDto enforces exactly what the ElectionDetailUnitsCandidates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailUnitsCandidatesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailUnitsCandidatesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailUnitsCandidatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailUnitsCandidatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailUnitsCandidatesExample.valid(),
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
