import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LawInstrumentDto } from "#/modules/insights/schema/dto/law-instrument.dto.ts";
import { lawInstrumentExample } from "@test/modules/insights/schema/dto/examples/law-instrument.dto.example.ts";

/** Managed by Dryv: LawInstrumentDto enforces exactly what the LawInstrument contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LawInstrumentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = lawInstrumentExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LawInstrumentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(lawInstrumentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...lawInstrumentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
