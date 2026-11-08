import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { JurisdictionsListResponseDto } from "#/modules/reference/dto/jurisdictions-list-response.dto.ts";
import { jurisdictionsListResponseExample } from "#/modules/reference/dto/jurisdictions-list-response.dto.example.ts";

/** Managed by Dryv: JurisdictionsListResponseDto enforces exactly what the JurisdictionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(JurisdictionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = jurisdictionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("JurisdictionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(jurisdictionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...jurisdictionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});