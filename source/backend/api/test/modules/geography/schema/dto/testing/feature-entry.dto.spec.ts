import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureEntryDto } from "#/modules/geography/schema/dto/feature-entry.dto.ts";
import { featureEntryExample } from "@test/modules/geography/schema/dto/examples/feature-entry.dto.example.ts";

/** Managed by Dryv: FeatureEntryDto enforces exactly what the FeatureEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...featureEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
