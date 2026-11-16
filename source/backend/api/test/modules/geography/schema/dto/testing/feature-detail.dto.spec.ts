import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FeatureDetailDto } from "#/modules/geography/schema/dto/feature-detail.dto.ts";
import { featureDetailExample } from "@test/modules/geography/schema/dto/examples/feature-detail.dto.example.ts";

/** Managed by Dryv: FeatureDetailDto enforces exactly what the FeatureDetail contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FeatureDetailDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = featureDetailExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FeatureDetailDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(featureDetailExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...featureDetailExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
