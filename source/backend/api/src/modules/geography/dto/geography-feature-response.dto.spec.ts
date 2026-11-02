import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyFeatureResponseDto } from "#/modules/geography/dto/geography-feature-response.dto.ts";
import { geographyFeatureResponseExample } from "#/modules/geography/dto/geography-feature-response.dto.example.ts";

/** Managed by Dryv: GeographyFeatureResponseDto enforces exactly what the GeographyFeatureResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(GeographyFeatureResponseDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = geographyFeatureResponseExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyFeatureResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyFeatureResponseExample.valid())).toEqual(
      [],
    );
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...geographyFeatureResponseExample.valid(),
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
