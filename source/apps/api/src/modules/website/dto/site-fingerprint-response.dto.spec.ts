import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFingerprintResponseDto } from "#/modules/website/dto/site-fingerprint-response.dto.ts";
import { siteFingerprintResponseExample } from "#/modules/website/dto/site-fingerprint-response.dto.example.ts";

/** Managed by Dryv: SiteFingerprintResponseDto enforces exactly what the SiteFingerprintResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFingerprintResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFingerprintResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFingerprintResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFingerprintResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFingerprintResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});