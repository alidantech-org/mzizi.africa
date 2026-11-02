import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalProvisionsListResponseDto } from "#/modules/legal/dto/legal-provisions-list-response.dto.ts";
import { legalProvisionsListResponseExample } from "#/modules/legal/dto/legal-provisions-list-response.dto.example.ts";

/** Managed by Dryv: LegalProvisionsListResponseDto enforces exactly what the LegalProvisionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalProvisionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalProvisionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalProvisionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalProvisionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalProvisionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});