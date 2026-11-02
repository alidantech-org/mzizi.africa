import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateDto } from "#/modules/elections/dto/candidate.dto.ts";
import { candidateExample } from "#/modules/elections/dto/candidate.dto.example.ts";

/** Managed by Dryv: CandidateDto enforces exactly what the Candidate contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});