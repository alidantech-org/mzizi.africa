import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SitePublisherDto } from "#/modules/website/dto/site-publisher.dto.ts";
import { sitePublisherExample } from "#/modules/website/dto/site-publisher.dto.example.ts";

/** Managed by Dryv: SitePublisherDto enforces exactly what the SitePublisher contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SitePublisherDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = sitePublisherExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SitePublisherDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(sitePublisherExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...sitePublisherExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});