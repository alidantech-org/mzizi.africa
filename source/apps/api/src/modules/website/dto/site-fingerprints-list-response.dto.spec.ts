import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFingerprintsListResponseDto } from "#/modules/website/dto/site-fingerprints-list-response.dto.ts";
import { siteFingerprintsListResponseExample } from "#/modules/website/dto/site-fingerprints-list-response.dto.example.ts";

/** Managed by Dryv: SiteFingerprintsListResponseDto enforces exactly what the SiteFingerprintsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFingerprintsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFingerprintsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFingerprintsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFingerprintsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFingerprintsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});