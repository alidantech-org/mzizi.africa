import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentKeyDto } from "#/modules/legal/schema/dto/instrument-key.dto.ts";
import { instrumentKeyExample } from "@test/modules/legal/schema/dto/examples/instrument-key.dto.example.ts";

/** Managed by Dryv: InstrumentKeyDto enforces exactly what the InstrumentKey contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentKeyDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentKeyExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentKeyDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentKeyExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...instrumentKeyExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
