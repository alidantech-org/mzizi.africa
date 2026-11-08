import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentChangeListQueryDto } from "#/modules/legal/dto/legal-amendment-change-list-query.dto.ts";
import { legalAmendmentChangeListQueryExample } from "#/modules/legal/dto/legal-amendment-change-list-query.dto.example.ts";

/** Managed by Dryv: LegalAmendmentChangeListQueryDto enforces exactly what the LegalAmendmentChangeListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentChangeListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentChangeListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentChangeListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentChangeListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentChangeListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});