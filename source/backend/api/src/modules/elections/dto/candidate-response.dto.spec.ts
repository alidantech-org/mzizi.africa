import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateResponseDto } from "#/modules/elections/dto/candidate-response.dto.ts";
import { candidateResponseExample } from "#/modules/elections/dto/candidate-response.dto.example.ts";

/** Managed by Dryv: CandidateResponseDto enforces exactly what the CandidateResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});