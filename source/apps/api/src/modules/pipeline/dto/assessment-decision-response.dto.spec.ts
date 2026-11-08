import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssessmentDecisionResponseDto } from "#/modules/pipeline/dto/assessment-decision-response.dto.ts";
import { assessmentDecisionResponseExample } from "#/modules/pipeline/dto/assessment-decision-response.dto.example.ts";

/** Managed by Dryv: AssessmentDecisionResponseDto enforces exactly what the AssessmentDecisionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssessmentDecisionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assessmentDecisionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AssessmentDecisionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assessmentDecisionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assessmentDecisionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});