import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SitePublisherPublicDto } from "#/modules/website/dto/site-publisher-public.dto.ts";
import { sitePublisherPublicExample } from "#/modules/website/dto/site-publisher-public.dto.example.ts";

/** Managed by Dryv: SitePublisherPublicDto enforces exactly what the SitePublisherPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SitePublisherPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sitePublisherPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SitePublisherPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sitePublisherPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sitePublisherPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});