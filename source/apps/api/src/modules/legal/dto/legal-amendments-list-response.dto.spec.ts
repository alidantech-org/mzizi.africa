import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentsListResponseDto } from "#/modules/legal/dto/legal-amendments-list-response.dto.ts";
import { legalAmendmentsListResponseExample } from "#/modules/legal/dto/legal-amendments-list-response.dto.example.ts";

/** Managed by Dryv: LegalAmendmentsListResponseDto enforces exactly what the LegalAmendmentsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});