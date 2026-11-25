import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentEntryNamesDto } from "#/modules/legal/schema/dto/instrument-entry-names.dto.ts";
import { instrumentEntryNamesExample } from "@test/modules/legal/schema/dto/examples/instrument-entry-names.dto.example.ts";

/** Managed by Dryv: InstrumentEntryNamesDto enforces exactly what the InstrumentEntryNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentEntryNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentEntryNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentEntryNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentEntryNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentEntryNamesExample.valid(),
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
