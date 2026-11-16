import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureWindowDto } from "#/modules/geography/schema/dto/feature-window.dto.ts";
import { featureWindowExample } from "@test/modules/geography/schema/dto/examples/feature-window.dto.example.ts";

/** Managed by Dryv: FeatureWindowDto enforces exactly what the FeatureWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...featureWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
