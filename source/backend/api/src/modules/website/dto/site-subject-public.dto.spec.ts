import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteSubjectPublicDto } from "#/modules/website/dto/site-subject-public.dto.ts";
import { siteSubjectPublicExample } from "#/modules/website/dto/site-subject-public.dto.example.ts";

/** Managed by Dryv: SiteSubjectPublicDto enforces exactly what the SiteSubjectPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteSubjectPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteSubjectPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteSubjectPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteSubjectPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteSubjectPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});