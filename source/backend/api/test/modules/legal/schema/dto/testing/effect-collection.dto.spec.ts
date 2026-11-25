import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EffectCollectionDto } from "#/modules/legal/schema/dto/effect-collection.dto.ts";
import { effectCollectionExample } from "@test/modules/legal/schema/dto/examples/effect-collection.dto.example.ts";

/** Managed by Dryv: EffectCollectionDto enforces exactly what the EffectCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EffectCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = effectCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EffectCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(effectCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...effectCollectionExample.valid(),
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
