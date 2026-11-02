import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SiteDomainPublicDto } from "#/modules/website/dto/site-domain-public.dto.ts";
import { siteDomainPublicExample } from "#/modules/website/dto/site-domain-public.dto.example.ts";

/** Managed by Dryv: SiteDomainPublicDto enforces exactly what the SiteDomainPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SiteDomainPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = siteDomainPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SiteDomainPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(siteDomainPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...siteDomainPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});