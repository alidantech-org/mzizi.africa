import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailMotionDto } from "#/modules/insights/schema/dto/motion-detail-motion.dto.ts";
import { motionDetailMotionExample } from "@test/modules/insights/schema/dto/examples/motion-detail-motion.dto.example.ts";

/** Managed by Dryv: MotionDetailMotionDto enforces exactly what the MotionDetailMotion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailMotionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailMotionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailMotionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailMotionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailMotionExample.valid(),
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
