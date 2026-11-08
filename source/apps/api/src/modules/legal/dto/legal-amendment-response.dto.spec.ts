import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentResponseDto } from "#/modules/legal/dto/legal-amendment-response.dto.ts";
import { legalAmendmentResponseExample } from "#/modules/legal/dto/legal-amendment-response.dto.example.ts";

/** Managed by Dryv: LegalAmendmentResponseDto enforces exactly what the LegalAmendmentResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});