import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidatesDto } from "#/modules/election/schema/dto/candidates.dto.ts";
import { candidatesExample } from "@test/modules/election/schema/dto/examples/candidates.dto.example.ts";

/** Managed by Dryv: CandidatesDto enforces exactly what the Candidates contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidatesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidatesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CandidatesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidatesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidatesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
