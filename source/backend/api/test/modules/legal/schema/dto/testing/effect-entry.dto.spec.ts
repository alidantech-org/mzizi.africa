import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EffectEntryDto } from "#/modules/legal/schema/dto/effect-entry.dto.ts";
import { effectEntryExample } from "@test/modules/legal/schema/dto/examples/effect-entry.dto.example.ts";

/** Managed by Dryv: EffectEntryDto enforces exactly what the EffectEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EffectEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = effectEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EffectEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(effectEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...effectEntryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
