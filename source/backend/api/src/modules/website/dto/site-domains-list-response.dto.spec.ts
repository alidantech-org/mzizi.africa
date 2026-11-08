import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteDomainsListResponseDto } from "#/modules/website/dto/site-domains-list-response.dto.ts";
import { siteDomainsListResponseExample } from "#/modules/website/dto/site-domains-list-response.dto.example.ts";

/** Managed by Dryv: SiteDomainsListResponseDto enforces exactly what the SiteDomainsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteDomainsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteDomainsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteDomainsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteDomainsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteDomainsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});