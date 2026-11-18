import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VotesDto } from "#/modules/governance/schema/dto/votes.dto.ts";
import { votesExample } from "@test/modules/governance/schema/dto/examples/votes.dto.example.ts";

/** Managed by Dryv: VotesDto enforces exactly what the Votes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VotesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = votesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("VotesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(votesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...votesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
