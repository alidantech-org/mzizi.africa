import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAuthorityLinkPublicDto } from "#/modules/legal/dto/legal-authority-link-public.dto.ts";
import { legalAuthorityLinkPublicExample } from "#/modules/legal/dto/legal-authority-link-public.dto.example.ts";

/** Managed by Dryv: LegalAuthorityLinkPublicDto enforces exactly what the LegalAuthorityLinkPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAuthorityLinkPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAuthorityLinkPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAuthorityLinkPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAuthorityLinkPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAuthorityLinkPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});