import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentChangePublicDto } from "#/modules/legal/dto/legal-amendment-change-public.dto.ts";
import { legalAmendmentChangePublicExample } from "#/modules/legal/dto/legal-amendment-change-public.dto.example.ts";

/** Managed by Dryv: LegalAmendmentChangePublicDto enforces exactly what the LegalAmendmentChangePublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentChangePublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentChangePublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentChangePublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentChangePublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentChangePublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});