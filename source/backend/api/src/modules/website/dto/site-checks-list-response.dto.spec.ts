import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteChecksListResponseDto } from "#/modules/website/dto/site-checks-list-response.dto.ts";
import { siteChecksListResponseExample } from "#/modules/website/dto/site-checks-list-response.dto.example.ts";

/** Managed by Dryv: SiteChecksListResponseDto enforces exactly what the SiteChecksListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteChecksListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteChecksListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteChecksListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteChecksListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteChecksListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});