import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionDetailUnitsWinnerDto } from "#/modules/insights/schema/dto/election-detail-units-winner.dto.ts";
import { electionDetailUnitsWinnerExample } from "@test/modules/insights/schema/dto/examples/election-detail-units-winner.dto.example.ts";

/** Managed by Dryv: ElectionDetailUnitsWinnerDto enforces exactly what the ElectionDetailUnitsWinner contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionDetailUnitsWinnerDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionDetailUnitsWinnerExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionDetailUnitsWinnerDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionDetailUnitsWinnerExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionDetailUnitsWinnerExample.valid(),
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
