import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssessmentListResponseDto } from "#/modules/pipeline/dto/assessment-list-response.dto.ts";
import { assessmentListResponseExample } from "#/modules/pipeline/dto/assessment-list-response.dto.example.ts";

/** Managed by Dryv: AssessmentListResponseDto enforces exactly what the AssessmentListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssessmentListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assessmentListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AssessmentListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assessmentListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assessmentListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});