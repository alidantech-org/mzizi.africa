import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { InstitutionsListResponseDto } from "#/modules/governance/dto/institutions-list-response.dto.ts";
import { institutionsListResponseExample } from "#/modules/governance/dto/institutions-list-response.dto.example.ts";

/** Managed by Dryv: InstitutionsListResponseDto enforces exactly what the InstitutionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(InstitutionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = institutionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("InstitutionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(institutionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...institutionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});