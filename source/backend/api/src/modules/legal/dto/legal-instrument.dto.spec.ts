import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalInstrumentDto } from "#/modules/legal/dto/legal-instrument.dto.ts";
import { legalInstrumentExample } from "#/modules/legal/dto/legal-instrument.dto.example.ts";

/** Managed by Dryv: LegalInstrumentDto enforces exactly what the LegalInstrument contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalInstrumentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalInstrumentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalInstrumentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalInstrumentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalInstrumentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});