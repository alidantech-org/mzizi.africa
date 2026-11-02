import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReviewDecisionsListResponseDto } from "#/modules/audit/dto/review-decisions-list-response.dto.ts";
import { reviewDecisionsListResponseExample } from "#/modules/audit/dto/review-decisions-list-response.dto.example.ts";

/** Managed by Dryv: ReviewDecisionsListResponseDto enforces exactly what the ReviewDecisionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReviewDecisionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = reviewDecisionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReviewDecisionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(reviewDecisionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...reviewDecisionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});