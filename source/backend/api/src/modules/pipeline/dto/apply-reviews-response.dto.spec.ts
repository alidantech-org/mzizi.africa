import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ApplyReviewsResponseDto } from "#/modules/pipeline/dto/apply-reviews-response.dto.ts";
import { applyReviewsResponseExample } from "#/modules/pipeline/dto/apply-reviews-response.dto.example.ts";

/** Managed by Dryv: ApplyReviewsResponseDto enforces exactly what the ApplyReviewsResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ApplyReviewsResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = applyReviewsResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ApplyReviewsResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(applyReviewsResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...applyReviewsResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});