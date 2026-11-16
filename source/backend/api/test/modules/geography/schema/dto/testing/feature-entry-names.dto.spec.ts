import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureEntryNamesDto } from "#/modules/geography/schema/dto/feature-entry-names.dto.ts";
import { featureEntryNamesExample } from "@test/modules/geography/schema/dto/examples/feature-entry-names.dto.example.ts";

/** Managed by Dryv: FeatureEntryNamesDto enforces exactly what the FeatureEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureEntryNamesExample.valid(),
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
