import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ApplyReviewsQueryDto } from "#/modules/pipeline/dto/apply-reviews-query.dto.ts";
import { applyReviewsQueryExample } from "#/modules/pipeline/dto/apply-reviews-query.dto.example.ts";

/** Managed by Dryv: ApplyReviewsQueryDto enforces exactly what the ApplyReviewsQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ApplyReviewsQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = applyReviewsQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ApplyReviewsQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(applyReviewsQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...applyReviewsQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});