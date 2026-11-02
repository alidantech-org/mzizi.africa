import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DomainZoneDto } from "#/modules/website/dto/domain-zone.dto.ts";
import { domainZoneExample } from "#/modules/website/dto/domain-zone.dto.example.ts";

/** Managed by Dryv: DomainZoneDto enforces exactly what the DomainZone contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DomainZoneDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = domainZoneExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DomainZoneDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(domainZoneExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...domainZoneExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});