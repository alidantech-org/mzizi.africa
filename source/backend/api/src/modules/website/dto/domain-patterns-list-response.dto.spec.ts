import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DomainPatternsListResponseDto } from "#/modules/website/dto/domain-patterns-list-response.dto.ts";
import { domainPatternsListResponseExample } from "#/modules/website/dto/domain-patterns-list-response.dto.example.ts";

/** Managed by Dryv: DomainPatternsListResponseDto enforces exactly what the DomainPatternsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DomainPatternsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = domainPatternsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DomainPatternsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(domainPatternsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...domainPatternsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});