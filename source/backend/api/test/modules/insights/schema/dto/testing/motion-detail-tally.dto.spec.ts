import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailTallyDto } from "#/modules/insights/schema/dto/motion-detail-tally.dto.ts";
import { motionDetailTallyExample } from "@test/modules/insights/schema/dto/examples/motion-detail-tally.dto.example.ts";

/** Managed by Dryv: MotionDetailTallyDto enforces exactly what the MotionDetailTally contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailTallyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailTallyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailTallyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailTallyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailTallyExample.valid(),
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
