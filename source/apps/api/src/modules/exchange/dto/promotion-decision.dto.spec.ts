import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PromotionDecisionDto } from "#/modules/exchange/dto/promotion-decision.dto.ts";
import { promotionDecisionExample } from "#/modules/exchange/dto/promotion-decision.dto.example.ts";

/** Managed by Dryv: PromotionDecisionDto enforces exactly what the PromotionDecision contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PromotionDecisionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = promotionDecisionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("PromotionDecisionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(promotionDecisionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...promotionDecisionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});