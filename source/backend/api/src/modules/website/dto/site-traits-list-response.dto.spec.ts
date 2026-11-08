import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteTraitsListResponseDto } from "#/modules/website/dto/site-traits-list-response.dto.ts";
import { siteTraitsListResponseExample } from "#/modules/website/dto/site-traits-list-response.dto.example.ts";

/** Managed by Dryv: SiteTraitsListResponseDto enforces exactly what the SiteTraitsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteTraitsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteTraitsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteTraitsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteTraitsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteTraitsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});