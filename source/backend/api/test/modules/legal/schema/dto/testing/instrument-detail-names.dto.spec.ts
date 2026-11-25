import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstrumentDetailNamesDto } from "#/modules/legal/schema/dto/instrument-detail-names.dto.ts";
import { instrumentDetailNamesExample } from "@test/modules/legal/schema/dto/examples/instrument-detail-names.dto.example.ts";

/** Managed by Dryv: InstrumentDetailNamesDto enforces exactly what the InstrumentDetailNames contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstrumentDetailNamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = instrumentDetailNamesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("InstrumentDetailNamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(instrumentDetailNamesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...instrumentDetailNamesExample.valid(),
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
