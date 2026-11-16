import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureKeyDto } from "#/modules/geography/schema/dto/feature-key.dto.ts";
import { featureKeyExample } from "@test/modules/geography/schema/dto/examples/feature-key.dto.example.ts";

/** Managed by Dryv: FeatureKeyDto enforces exactly what the FeatureKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...featureKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
