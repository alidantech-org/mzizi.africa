import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureKindCollectionDto } from "#/modules/geography/schema/dto/feature-kind-collection.dto.ts";
import { featureKindCollectionExample } from "@test/modules/geography/schema/dto/examples/feature-kind-collection.dto.example.ts";

/** Managed by Dryv: FeatureKindCollectionDto enforces exactly what the FeatureKindCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureKindCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureKindCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureKindCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureKindCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureKindCollectionExample.valid(),
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
