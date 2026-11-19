import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicLeadershipDto } from "#/modules/insights/schema/dto/place-civic-leadership.dto.ts";
import { placeCivicLeadershipExample } from "@test/modules/insights/schema/dto/examples/place-civic-leadership.dto.example.ts";

/** Managed by Dryv: PlaceCivicLeadershipDto enforces exactly what the PlaceCivicLeadership contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicLeadershipDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicLeadershipExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicLeadershipDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicLeadershipExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicLeadershipExample.valid(),
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
