import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFingerprintPublicDto } from "#/modules/website/dto/site-fingerprint-public.dto.ts";
import { siteFingerprintPublicExample } from "#/modules/website/dto/site-fingerprint-public.dto.example.ts";

/** Managed by Dryv: SiteFingerprintPublicDto enforces exactly what the SiteFingerprintPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFingerprintPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFingerprintPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFingerprintPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFingerprintPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFingerprintPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});