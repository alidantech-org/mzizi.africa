import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CountdownMilestoneDto } from "#/modules/experience/schema/dto/countdown-milestone.dto.ts";
import { countdownMilestoneExample } from "@test/modules/experience/schema/dto/examples/countdown-milestone.dto.example.ts";

/** Managed by Dryv: CountdownMilestoneDto enforces exactly what the CountdownMilestone contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CountdownMilestoneDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = countdownMilestoneExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CountdownMilestoneDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(countdownMilestoneExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...countdownMilestoneExample.valid(),
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
