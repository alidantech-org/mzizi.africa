import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteCheckResponseDto } from "#/modules/website/dto/site-check-response.dto.ts";
import { siteCheckResponseExample } from "#/modules/website/dto/site-check-response.dto.example.ts";

/** Managed by Dryv: SiteCheckResponseDto enforces exactly what the SiteCheckResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteCheckResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteCheckResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteCheckResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteCheckResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteCheckResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});