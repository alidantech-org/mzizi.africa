import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureGeometryDto } from "#/modules/geography/schema/dto/feature-geometry.dto.ts";
import { featureGeometryExample } from "@test/modules/geography/schema/dto/examples/feature-geometry.dto.example.ts";

/** Managed by Dryv: FeatureGeometryDto enforces exactly what the FeatureGeometry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureGeometryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureGeometryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureGeometryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureGeometryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...featureGeometryExample.valid(),
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
