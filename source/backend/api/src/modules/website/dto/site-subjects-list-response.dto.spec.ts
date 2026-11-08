import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteSubjectsListResponseDto } from "#/modules/website/dto/site-subjects-list-response.dto.ts";
import { siteSubjectsListResponseExample } from "#/modules/website/dto/site-subjects-list-response.dto.example.ts";

/** Managed by Dryv: SiteSubjectsListResponseDto enforces exactly what the SiteSubjectsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteSubjectsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteSubjectsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteSubjectsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteSubjectsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteSubjectsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});