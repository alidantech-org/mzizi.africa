import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalInstrumentListQueryDto } from "#/modules/legal/dto/legal-instrument-list-query.dto.ts";
import { legalInstrumentListQueryExample } from "#/modules/legal/dto/legal-instrument-list-query.dto.example.ts";

/** Managed by Dryv: LegalInstrumentListQueryDto enforces exactly what the LegalInstrumentListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalInstrumentListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalInstrumentListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalInstrumentListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalInstrumentListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalInstrumentListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});