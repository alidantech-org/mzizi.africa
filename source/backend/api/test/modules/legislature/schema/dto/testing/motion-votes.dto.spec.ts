import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { MotionVotesDto } from "#/modules/legislature/schema/dto/motion-votes.dto.ts";
import { motionVotesExample } from "@test/modules/legislature/schema/dto/examples/motion-votes.dto.example.ts";

/** Managed by Dryv: MotionVotesDto enforces exactly what the MotionVotes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(MotionVotesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = motionVotesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("MotionVotesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(motionVotesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...motionVotesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
