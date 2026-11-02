import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VerificationPublicDto } from "#/modules/source/dto/verification-public.dto.ts";
import { verificationPublicExample } from "#/modules/source/dto/verification-public.dto.example.ts";

/** Managed by Dryv: VerificationPublicDto enforces exactly what the VerificationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VerificationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = verificationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VerificationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(verificationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...verificationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});