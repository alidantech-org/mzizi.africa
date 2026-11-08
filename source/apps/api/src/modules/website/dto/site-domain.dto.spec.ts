import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteDomainDto } from "#/modules/website/dto/site-domain.dto.ts";
import { siteDomainExample } from "#/modules/website/dto/site-domain.dto.example.ts";

/** Managed by Dryv: SiteDomainDto enforces exactly what the SiteDomain contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteDomainDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteDomainExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteDomainDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteDomainExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteDomainExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});