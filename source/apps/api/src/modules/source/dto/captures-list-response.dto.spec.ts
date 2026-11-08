import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CapturesListResponseDto } from "#/modules/source/dto/captures-list-response.dto.ts";
import { capturesListResponseExample } from "#/modules/source/dto/captures-list-response.dto.example.ts";

/** Managed by Dryv: CapturesListResponseDto enforces exactly what the CapturesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CapturesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = capturesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CapturesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(capturesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...capturesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});