import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAuthorityLinkDto } from "#/modules/legal/dto/legal-authority-link.dto.ts";
import { legalAuthorityLinkExample } from "#/modules/legal/dto/legal-authority-link.dto.example.ts";

/** Managed by Dryv: LegalAuthorityLinkDto enforces exactly what the LegalAuthorityLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAuthorityLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAuthorityLinkExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAuthorityLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAuthorityLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAuthorityLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});