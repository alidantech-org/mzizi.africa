import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LegalProvisionPublicDto } from "#/modules/legal/dto/legal-provision-public.dto.ts";
import { legalProvisionPublicExample } from "#/modules/legal/dto/legal-provision-public.dto.example.ts";

/** Managed by Dryv: LegalProvisionPublicDto enforces exactly what the LegalProvisionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LegalProvisionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = legalProvisionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("LegalProvisionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(legalProvisionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...legalProvisionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});