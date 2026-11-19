import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailMotionContributionsDto } from "#/modules/insights/schema/dto/motion-detail-motion-contributions.dto.ts";
import { motionDetailMotionContributionsExample } from "@test/modules/insights/schema/dto/examples/motion-detail-motion-contributions.dto.example.ts";

/** Managed by Dryv: MotionDetailMotionContributionsDto enforces exactly what the MotionDetailMotionContributions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailMotionContributionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailMotionContributionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailMotionContributionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailMotionContributionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailMotionContributionsExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
