import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VoteEntryDto } from "#/modules/legislature/schema/dto/vote-entry.dto.ts";
import { voteEntryExample } from "@test/modules/legislature/schema/dto/examples/vote-entry.dto.example.ts";

/** Managed by Dryv: VoteEntryDto enforces exactly what the VoteEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VoteEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = voteEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VoteEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(voteEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...voteEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
