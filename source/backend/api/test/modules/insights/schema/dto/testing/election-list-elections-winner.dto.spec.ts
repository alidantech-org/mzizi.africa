import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionListElectionsWinnerDto } from "#/modules/insights/schema/dto/election-list-elections-winner.dto.ts";
import { electionListElectionsWinnerExample } from "@test/modules/insights/schema/dto/examples/election-list-elections-winner.dto.example.ts";

/** Managed by Dryv: ElectionListElectionsWinnerDto enforces exactly what the ElectionListElectionsWinner contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionListElectionsWinnerDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionListElectionsWinnerExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionListElectionsWinnerDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionListElectionsWinnerExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionListElectionsWinnerExample.valid(),
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
