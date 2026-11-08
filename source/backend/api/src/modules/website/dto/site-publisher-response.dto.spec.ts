import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SitePublisherResponseDto } from "#/modules/website/dto/site-publisher-response.dto.ts";
import { sitePublisherResponseExample } from "#/modules/website/dto/site-publisher-response.dto.example.ts";

/** Managed by Dryv: SitePublisherResponseDto enforces exactly what the SitePublisherResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SitePublisherResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sitePublisherResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SitePublisherResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sitePublisherResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sitePublisherResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});