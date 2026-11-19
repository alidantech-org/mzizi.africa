import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PlaceCivicLeadershipEvidenceDto } from "#/modules/insights/schema/dto/place-civic-leadership-evidence.dto.ts";
import { placeCivicLeadershipEvidenceExample } from "@test/modules/insights/schema/dto/examples/place-civic-leadership-evidence.dto.example.ts";

/** Managed by Dryv: PlaceCivicLeadershipEvidenceDto enforces exactly what the PlaceCivicLeadershipEvidence contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PlaceCivicLeadershipEvidenceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = placeCivicLeadershipEvidenceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PlaceCivicLeadershipEvidenceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(placeCivicLeadershipEvidenceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...placeCivicLeadershipEvidenceExample.valid(),
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
