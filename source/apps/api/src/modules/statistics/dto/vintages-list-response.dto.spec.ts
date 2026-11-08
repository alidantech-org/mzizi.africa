import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { VintagesListResponseDto } from "#/modules/statistics/dto/vintages-list-response.dto.ts";
import { vintagesListResponseExample } from "#/modules/statistics/dto/vintages-list-response.dto.example.ts";

/** Managed by Dryv: VintagesListResponseDto enforces exactly what the VintagesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(VintagesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = vintagesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("VintagesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(vintagesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...vintagesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});