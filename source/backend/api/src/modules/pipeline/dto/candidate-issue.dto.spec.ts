import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateIssueDto } from "#/modules/pipeline/dto/candidate-issue.dto.ts";
import { candidateIssueExample } from "#/modules/pipeline/dto/candidate-issue.dto.example.ts";

/** Managed by Dryv: CandidateIssueDto enforces exactly what the CandidateIssue contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateIssueDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateIssueExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateIssueDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateIssueExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateIssueExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});