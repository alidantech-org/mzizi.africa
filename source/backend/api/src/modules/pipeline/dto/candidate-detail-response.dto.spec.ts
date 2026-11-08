import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateDetailResponseDto } from "#/modules/pipeline/dto/candidate-detail-response.dto.ts";
import { candidateDetailResponseExample } from "#/modules/pipeline/dto/candidate-detail-response.dto.example.ts";

/** Managed by Dryv: CandidateDetailResponseDto enforces exactly what the CandidateDetailResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateDetailResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateDetailResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateDetailResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateDetailResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateDetailResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});