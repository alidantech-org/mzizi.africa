import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureGeometryCollectionDto } from "#/modules/geography/schema/dto/feature-geometry-collection.dto.ts";
import { featureGeometryCollectionExample } from "@test/modules/geography/schema/dto/examples/feature-geometry-collection.dto.example.ts";

/** Managed by Dryv: FeatureGeometryCollectionDto enforces exactly what the FeatureGeometryCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureGeometryCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureGeometryCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureGeometryCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureGeometryCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureGeometryCollectionExample.valid(),
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
