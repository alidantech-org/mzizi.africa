import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionListMotionsDto } from "#/modules/insights/schema/dto/motion-list-motions.dto.ts";
import { motionListMotionsExample } from "@test/modules/insights/schema/dto/examples/motion-list-motions.dto.example.ts";

/** Managed by Dryv: MotionListMotionsDto enforces exactly what the MotionListMotions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionListMotionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionListMotionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionListMotionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionListMotionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionListMotionsExample.valid(),
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
