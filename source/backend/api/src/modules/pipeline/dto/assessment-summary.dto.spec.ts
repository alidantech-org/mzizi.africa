import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssessmentSummaryDto } from "#/modules/pipeline/dto/assessment-summary.dto.ts";
import { assessmentSummaryExample } from "#/modules/pipeline/dto/assessment-summary.dto.example.ts";

/** Managed by Dryv: AssessmentSummaryDto enforces exactly what the AssessmentSummary contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssessmentSummaryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assessmentSummaryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AssessmentSummaryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assessmentSummaryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assessmentSummaryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});