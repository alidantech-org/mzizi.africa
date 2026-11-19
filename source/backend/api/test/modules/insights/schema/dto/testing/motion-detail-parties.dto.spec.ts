import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailPartiesDto } from "#/modules/insights/schema/dto/motion-detail-parties.dto.ts";
import { motionDetailPartiesExample } from "@test/modules/insights/schema/dto/examples/motion-detail-parties.dto.example.ts";

/** Managed by Dryv: MotionDetailPartiesDto enforces exactly what the MotionDetailParties contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailPartiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailPartiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailPartiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailPartiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailPartiesExample.valid(),
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
