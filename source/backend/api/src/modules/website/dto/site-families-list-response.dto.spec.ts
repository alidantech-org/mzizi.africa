import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteFamiliesListResponseDto } from "#/modules/website/dto/site-families-list-response.dto.ts";
import { siteFamiliesListResponseExample } from "#/modules/website/dto/site-families-list-response.dto.example.ts";

/** Managed by Dryv: SiteFamiliesListResponseDto enforces exactly what the SiteFamiliesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteFamiliesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteFamiliesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteFamiliesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteFamiliesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteFamiliesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});