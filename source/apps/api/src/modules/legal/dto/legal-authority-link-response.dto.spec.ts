import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAuthorityLinkResponseDto } from "#/modules/legal/dto/legal-authority-link-response.dto.ts";
import { legalAuthorityLinkResponseExample } from "#/modules/legal/dto/legal-authority-link-response.dto.example.ts";

/** Managed by Dryv: LegalAuthorityLinkResponseDto enforces exactly what the LegalAuthorityLinkResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAuthorityLinkResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAuthorityLinkResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAuthorityLinkResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAuthorityLinkResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAuthorityLinkResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});