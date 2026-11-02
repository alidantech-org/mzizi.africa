import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteRelationResponseDto } from "#/modules/website/dto/site-relation-response.dto.ts";
import { siteRelationResponseExample } from "#/modules/website/dto/site-relation-response.dto.example.ts";

/** Managed by Dryv: SiteRelationResponseDto enforces exactly what the SiteRelationResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteRelationResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteRelationResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteRelationResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteRelationResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteRelationResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});