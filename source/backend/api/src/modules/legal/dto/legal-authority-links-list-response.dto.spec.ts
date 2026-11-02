import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAuthorityLinksListResponseDto } from "#/modules/legal/dto/legal-authority-links-list-response.dto.ts";
import { legalAuthorityLinksListResponseExample } from "#/modules/legal/dto/legal-authority-links-list-response.dto.example.ts";

/** Managed by Dryv: LegalAuthorityLinksListResponseDto enforces exactly what the LegalAuthorityLinksListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAuthorityLinksListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAuthorityLinksListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAuthorityLinksListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAuthorityLinksListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAuthorityLinksListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});