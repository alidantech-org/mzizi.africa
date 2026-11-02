import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographySearchResponseDto } from "#/modules/geography/dto/geography-search-response.dto.ts";
import { geographySearchResponseExample } from "#/modules/geography/dto/geography-search-response.dto.example.ts";

/** Managed by Dryv: GeographySearchResponseDto enforces exactly what the GeographySearchResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(
    plainToInstance(GeographySearchResponseDto, value),
    {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
    },
  );
  return errors.map((error) => error.property);
}

const cases = geographySearchResponseExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("GeographySearchResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographySearchResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...geographySearchResponseExample.valid(),
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
