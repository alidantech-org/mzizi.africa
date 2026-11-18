import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompareOptionsInputDto } from "#/modules/insights/schema/dto/compare-options-input.dto.ts";
import { compareOptionsInputExample } from "@test/modules/insights/schema/dto/examples/compare-options-input.dto.example.ts";

/** Managed by Dryv: CompareOptionsInputDto enforces exactly what the CompareOptionsInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompareOptionsInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compareOptionsInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompareOptionsInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compareOptionsInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...compareOptionsInputExample.valid(),
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
