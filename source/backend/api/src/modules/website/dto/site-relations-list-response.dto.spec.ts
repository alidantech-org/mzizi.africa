import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteRelationsListResponseDto } from "#/modules/website/dto/site-relations-list-response.dto.ts";
import { siteRelationsListResponseExample } from "#/modules/website/dto/site-relations-list-response.dto.example.ts";

/** Managed by Dryv: SiteRelationsListResponseDto enforces exactly what the SiteRelationsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteRelationsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteRelationsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteRelationsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteRelationsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteRelationsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});