import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TallyEntryDto } from "#/modules/election/schema/dto/tally-entry.dto.ts";
import { tallyEntryExample } from "@test/modules/election/schema/dto/examples/tally-entry.dto.example.ts";

/** Managed by Dryv: TallyEntryDto enforces exactly what the TallyEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TallyEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = tallyEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TallyEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(tallyEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...tallyEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
