import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AssessmentDto } from "#/modules/website/dto/assessment.dto.ts";
import { assessmentExample } from "#/modules/website/dto/assessment.dto.example.ts";

/** Managed by Dryv: AssessmentDto enforces exactly what the Assessment contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AssessmentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = assessmentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AssessmentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(assessmentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...assessmentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});