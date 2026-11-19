import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsNearbyDto } from "#/modules/insights/schema/dto/compare-options-nearby.dto.ts";
import { compareOptionsNearbyExample } from "@test/modules/insights/schema/dto/examples/compare-options-nearby.dto.example.ts";

/** Managed by Dryv: CompareOptionsNearbyDto enforces exactly what the CompareOptionsNearby contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsNearbyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsNearbyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsNearbyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsNearbyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsNearbyExample.valid(),
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
