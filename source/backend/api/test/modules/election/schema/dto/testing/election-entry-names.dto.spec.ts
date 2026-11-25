import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionEntryNamesDto } from "#/modules/election/schema/dto/election-entry-names.dto.ts";
import { electionEntryNamesExample } from "@test/modules/election/schema/dto/examples/election-entry-names.dto.example.ts";

/** Managed by Dryv: ElectionEntryNamesDto enforces exactly what the ElectionEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...electionEntryNamesExample.valid(),
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
