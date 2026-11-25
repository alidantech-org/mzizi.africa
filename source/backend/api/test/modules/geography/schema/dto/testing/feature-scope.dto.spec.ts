import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureScopeDto } from "#/modules/geography/schema/dto/feature-scope.dto.ts";
import { featureScopeExample } from "@test/modules/geography/schema/dto/examples/feature-scope.dto.example.ts";

/** Managed by Dryv: FeatureScopeDto enforces exactly what the FeatureScope contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureScopeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureScopeExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureScopeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureScopeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...featureScopeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
