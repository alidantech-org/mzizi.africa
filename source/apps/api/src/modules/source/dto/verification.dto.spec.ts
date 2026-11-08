import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VerificationDto } from "#/modules/source/dto/verification.dto.ts";
import { verificationExample } from "#/modules/source/dto/verification.dto.example.ts";

/** Managed by Dryv: VerificationDto enforces exactly what the Verification contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VerificationDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = verificationExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VerificationDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(verificationExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...verificationExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});