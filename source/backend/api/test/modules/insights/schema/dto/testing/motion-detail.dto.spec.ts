import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailDto } from "#/modules/insights/schema/dto/motion-detail.dto.ts";
import { motionDetailExample } from "@test/modules/insights/schema/dto/examples/motion-detail.dto.example.ts";

/** Managed by Dryv: MotionDetailDto enforces exactly what the MotionDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...motionDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
