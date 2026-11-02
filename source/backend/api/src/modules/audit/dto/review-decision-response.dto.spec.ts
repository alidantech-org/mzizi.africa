import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReviewDecisionResponseDto } from "#/modules/audit/dto/review-decision-response.dto.ts";
import { reviewDecisionResponseExample } from "#/modules/audit/dto/review-decision-response.dto.example.ts";

/** Managed by Dryv: ReviewDecisionResponseDto enforces exactly what the ReviewDecisionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReviewDecisionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reviewDecisionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReviewDecisionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reviewDecisionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reviewDecisionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});