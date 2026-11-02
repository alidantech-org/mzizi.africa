import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalInstrumentsListResponseDto } from "#/modules/legal/dto/legal-instruments-list-response.dto.ts";
import { legalInstrumentsListResponseExample } from "#/modules/legal/dto/legal-instruments-list-response.dto.example.ts";

/** Managed by Dryv: LegalInstrumentsListResponseDto enforces exactly what the LegalInstrumentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalInstrumentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalInstrumentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalInstrumentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalInstrumentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalInstrumentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});