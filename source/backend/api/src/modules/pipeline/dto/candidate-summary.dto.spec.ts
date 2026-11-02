import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateSummaryDto } from "#/modules/pipeline/dto/candidate-summary.dto.ts";
import { candidateSummaryExample } from "#/modules/pipeline/dto/candidate-summary.dto.example.ts";

/** Managed by Dryv: CandidateSummaryDto enforces exactly what the CandidateSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});