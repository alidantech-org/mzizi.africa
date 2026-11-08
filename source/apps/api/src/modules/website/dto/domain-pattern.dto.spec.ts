import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DomainPatternDto } from "#/modules/website/dto/domain-pattern.dto.ts";
import { domainPatternExample } from "#/modules/website/dto/domain-pattern.dto.example.ts";

/** Managed by Dryv: DomainPatternDto enforces exactly what the DomainPattern contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DomainPatternDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = domainPatternExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DomainPatternDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(domainPatternExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...domainPatternExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});