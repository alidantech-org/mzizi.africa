import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttributionsListResponseDto } from "#/modules/source/dto/attributions-list-response.dto.ts";
import { attributionsListResponseExample } from "#/modules/source/dto/attributions-list-response.dto.example.ts";

/** Managed by Dryv: AttributionsListResponseDto enforces exactly what the AttributionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttributionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attributionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AttributionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attributionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attributionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});