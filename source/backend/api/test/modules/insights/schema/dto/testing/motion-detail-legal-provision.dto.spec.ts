import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailLegalProvisionDto } from "#/modules/insights/schema/dto/motion-detail-legal-provision.dto.ts";
import { motionDetailLegalProvisionExample } from "@test/modules/insights/schema/dto/examples/motion-detail-legal-provision.dto.example.ts";

/** Managed by Dryv: MotionDetailLegalProvisionDto enforces exactly what the MotionDetailLegalProvision contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailLegalProvisionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailLegalProvisionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailLegalProvisionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailLegalProvisionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailLegalProvisionExample.valid(),
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
