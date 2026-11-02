import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAuthorityLinkListQueryDto } from "#/modules/legal/dto/legal-authority-link-list-query.dto.ts";
import { legalAuthorityLinkListQueryExample } from "#/modules/legal/dto/legal-authority-link-list-query.dto.example.ts";

/** Managed by Dryv: LegalAuthorityLinkListQueryDto enforces exactly what the LegalAuthorityLinkListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAuthorityLinkListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAuthorityLinkListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAuthorityLinkListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAuthorityLinkListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAuthorityLinkListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});