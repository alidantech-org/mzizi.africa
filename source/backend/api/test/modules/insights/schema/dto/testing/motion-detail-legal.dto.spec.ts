import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailLegalDto } from "#/modules/insights/schema/dto/motion-detail-legal.dto.ts";
import { motionDetailLegalExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal.dto.example.ts";

/** Managed by Dryv: MotionDetailLegalDto enforces exactly what the MotionDetailLegal contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailLegalDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailLegalExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailLegalDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailLegalExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailLegalExample.valid(),
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
