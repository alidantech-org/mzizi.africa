import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentDto } from "#/modules/legal/dto/legal-amendment.dto.ts";
import { legalAmendmentExample } from "#/modules/legal/dto/legal-amendment.dto.example.ts";

/** Managed by Dryv: LegalAmendmentDto enforces exactly what the LegalAmendment contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});