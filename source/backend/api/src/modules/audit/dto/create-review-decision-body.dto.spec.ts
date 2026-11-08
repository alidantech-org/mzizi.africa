import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CreateReviewDecisionBodyDto } from "#/modules/audit/dto/create-review-decision-body.dto.ts";
import { createReviewDecisionBodyExample } from "#/modules/audit/dto/create-review-decision-body.dto.example.ts";

/** Managed by Dryv: CreateReviewDecisionBodyDto enforces exactly what the CreateReviewDecisionBody contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CreateReviewDecisionBodyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = createReviewDecisionBodyExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CreateReviewDecisionBodyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(createReviewDecisionBodyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...createReviewDecisionBodyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});