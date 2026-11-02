import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentChangeDto } from "#/modules/legal/dto/legal-amendment-change.dto.ts";
import { legalAmendmentChangeExample } from "#/modules/legal/dto/legal-amendment-change.dto.example.ts";

/** Managed by Dryv: LegalAmendmentChangeDto enforces exactly what the LegalAmendmentChange contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentChangeDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentChangeExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentChangeDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentChangeExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentChangeExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});