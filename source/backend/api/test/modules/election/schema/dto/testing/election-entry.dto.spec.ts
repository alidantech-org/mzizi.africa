import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionEntryDto } from "#/modules/election/schema/dto/election-entry.dto.ts";
import { electionEntryExample } from "@test/modules/election/schema/dto/examples/election-entry.dto.example.ts";

/** Managed by Dryv: ElectionEntryDto enforces exactly what the ElectionEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
