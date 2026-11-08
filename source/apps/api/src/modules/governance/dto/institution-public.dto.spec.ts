import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionPublicDto } from "#/modules/governance/dto/institution-public.dto.ts";
import { institutionPublicExample } from "#/modules/governance/dto/institution-public.dto.example.ts";

/** Managed by Dryv: InstitutionPublicDto enforces exactly what the InstitutionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});