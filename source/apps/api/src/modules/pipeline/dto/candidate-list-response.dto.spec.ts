import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateListResponseDto } from "#/modules/pipeline/dto/candidate-list-response.dto.ts";
import { candidateListResponseExample } from "#/modules/pipeline/dto/candidate-list-response.dto.example.ts";

/** Managed by Dryv: CandidateListResponseDto enforces exactly what the CandidateListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});