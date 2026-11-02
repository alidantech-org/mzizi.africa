import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DomainPatternPublicDto } from "#/modules/website/dto/domain-pattern-public.dto.ts";
import { domainPatternPublicExample } from "#/modules/website/dto/domain-pattern-public.dto.example.ts";

/** Managed by Dryv: DomainPatternPublicDto enforces exactly what the DomainPatternPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DomainPatternPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = domainPatternPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DomainPatternPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(domainPatternPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...domainPatternPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});