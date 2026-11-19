import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionDetailMembersDto } from "#/modules/insights/schema/dto/motion-detail-members.dto.ts";
import { motionDetailMembersExample } from "@test/modules/insights/schema/dto/examples/motion-detail-members.dto.example.ts";

/** Managed by Dryv: MotionDetailMembersDto enforces exactly what the MotionDetailMembers contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionDetailMembersDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionDetailMembersExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionDetailMembersDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionDetailMembersExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...motionDetailMembersExample.valid(),
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
