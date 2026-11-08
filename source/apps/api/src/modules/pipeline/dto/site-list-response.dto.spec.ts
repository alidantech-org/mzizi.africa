import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteListResponseDto } from "#/modules/pipeline/dto/site-list-response.dto.ts";
import { siteListResponseExample } from "#/modules/pipeline/dto/site-list-response.dto.example.ts";

/** Managed by Dryv: SiteListResponseDto enforces exactly what the SiteListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});