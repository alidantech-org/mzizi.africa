import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VerificationResponseDto } from "#/modules/source/dto/verification-response.dto.ts";
import { verificationResponseExample } from "#/modules/source/dto/verification-response.dto.example.ts";

/** Managed by Dryv: VerificationResponseDto enforces exactly what the VerificationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VerificationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = verificationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VerificationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(verificationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...verificationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});