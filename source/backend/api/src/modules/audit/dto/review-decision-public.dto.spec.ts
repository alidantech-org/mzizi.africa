import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReviewDecisionPublicDto } from "#/modules/audit/dto/review-decision-public.dto.ts";
import { reviewDecisionPublicExample } from "#/modules/audit/dto/review-decision-public.dto.example.ts";

/** Managed by Dryv: ReviewDecisionPublicDto enforces exactly what the ReviewDecisionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReviewDecisionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reviewDecisionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReviewDecisionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reviewDecisionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reviewDecisionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});