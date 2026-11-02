import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentListQueryDto } from "#/modules/legal/dto/legal-amendment-list-query.dto.ts";
import { legalAmendmentListQueryExample } from "#/modules/legal/dto/legal-amendment-list-query.dto.example.ts";

/** Managed by Dryv: LegalAmendmentListQueryDto enforces exactly what the LegalAmendmentListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});