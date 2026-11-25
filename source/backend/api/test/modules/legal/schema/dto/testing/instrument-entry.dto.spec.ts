import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentEntryDto } from "#/modules/legal/schema/dto/instrument-entry.dto.ts";
import { instrumentEntryExample } from "@test/modules/legal/schema/dto/examples/instrument-entry.dto.example.ts";

/** Managed by Dryv: InstrumentEntryDto enforces exactly what the InstrumentEntry contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentEntryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentEntryExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentEntryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentEntryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentEntryExample.valid(),
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
