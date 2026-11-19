import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsPlaceDto } from "#/modules/insights/schema/dto/compare-options-place.dto.ts";
import { compareOptionsPlaceExample } from "@test/modules/insights/schema/dto/examples/compare-options-place.dto.example.ts";

/** Managed by Dryv: CompareOptionsPlaceDto enforces exactly what the CompareOptionsPlace contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsPlaceDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsPlaceExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsPlaceDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsPlaceExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsPlaceExample.valid(),
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
