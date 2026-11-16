import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureDetailNamesDto } from "#/modules/geography/schema/dto/feature-detail-names.dto.ts";
import { featureDetailNamesExample } from "@test/modules/geography/schema/dto/examples/feature-detail-names.dto.example.ts";

/** Managed by Dryv: FeatureDetailNamesDto enforces exactly what the FeatureDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureDetailNamesExample.valid(),
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
