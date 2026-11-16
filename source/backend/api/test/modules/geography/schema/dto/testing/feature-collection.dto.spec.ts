import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureCollectionDto } from "#/modules/geography/schema/dto/feature-collection.dto.ts";
import { featureCollectionExample } from "@test/modules/geography/schema/dto/examples/feature-collection.dto.example.ts";

/** Managed by Dryv: FeatureCollectionDto enforces exactly what the FeatureCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureCollectionExample.valid(),
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
