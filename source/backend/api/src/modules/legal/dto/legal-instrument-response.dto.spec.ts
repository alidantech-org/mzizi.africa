import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalInstrumentResponseDto } from "#/modules/legal/dto/legal-instrument-response.dto.ts";
import { legalInstrumentResponseExample } from "#/modules/legal/dto/legal-instrument-response.dto.example.ts";

/** Managed by Dryv: LegalInstrumentResponseDto enforces exactly what the LegalInstrumentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalInstrumentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalInstrumentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalInstrumentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalInstrumentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalInstrumentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});