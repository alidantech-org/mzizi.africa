import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalAmendmentPublicDto } from "#/modules/legal/dto/legal-amendment-public.dto.ts";
import { legalAmendmentPublicExample } from "#/modules/legal/dto/legal-amendment-public.dto.example.ts";

/** Managed by Dryv: LegalAmendmentPublicDto enforces exactly what the LegalAmendmentPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalAmendmentPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalAmendmentPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalAmendmentPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalAmendmentPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalAmendmentPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});