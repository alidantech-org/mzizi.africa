import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReviewDecisionDto } from "#/modules/audit/dto/review-decision.dto.ts";
import { reviewDecisionExample } from "#/modules/audit/dto/review-decision.dto.example.ts";

/** Managed by Dryv: ReviewDecisionDto enforces exactly what the ReviewDecision contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReviewDecisionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reviewDecisionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReviewDecisionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reviewDecisionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reviewDecisionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});