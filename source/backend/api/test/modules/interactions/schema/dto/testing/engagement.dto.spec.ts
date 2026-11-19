import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EngagementDto } from "#/modules/interactions/schema/dto/engagement.dto.ts";
import { engagementExample } from "@test/modules/interactions/schema/dto/examples/engagement.dto.example.ts";

/** Managed by Dryv: EngagementDto enforces exactly what the Engagement contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EngagementDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = engagementExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EngagementDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(engagementExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...engagementExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
