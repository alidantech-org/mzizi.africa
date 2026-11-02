import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFingerprintDto } from "#/modules/website/dto/site-fingerprint.dto.ts";
import { siteFingerprintExample } from "#/modules/website/dto/site-fingerprint.dto.example.ts";

/** Managed by Dryv: SiteFingerprintDto enforces exactly what the SiteFingerprint contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFingerprintDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFingerprintExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFingerprintDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFingerprintExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFingerprintExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});