import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteSubjectResponseDto } from "#/modules/website/dto/site-subject-response.dto.ts";
import { siteSubjectResponseExample } from "#/modules/website/dto/site-subject-response.dto.example.ts";

/** Managed by Dryv: SiteSubjectResponseDto enforces exactly what the SiteSubjectResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteSubjectResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteSubjectResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteSubjectResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteSubjectResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteSubjectResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});