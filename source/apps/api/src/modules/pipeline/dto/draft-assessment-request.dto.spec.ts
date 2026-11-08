import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DraftAssessmentRequestDto } from "#/modules/pipeline/dto/draft-assessment-request.dto.ts";
import { draftAssessmentRequestExample } from "#/modules/pipeline/dto/draft-assessment-request.dto.example.ts";

/** Managed by Dryv: DraftAssessmentRequestDto enforces exactly what the DraftAssessmentRequest contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DraftAssessmentRequestDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = draftAssessmentRequestExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DraftAssessmentRequestDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(draftAssessmentRequestExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...draftAssessmentRequestExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});