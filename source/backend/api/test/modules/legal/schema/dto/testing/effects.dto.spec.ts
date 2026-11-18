import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EffectsDto } from "#/modules/legal/schema/dto/effects.dto.ts";
import { effectsExample } from "@test/modules/legal/schema/dto/examples/effects.dto.example.ts";

/** Managed by Dryv: EffectsDto enforces exactly what the Effects contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EffectsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = effectsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EffectsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(effectsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...effectsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
