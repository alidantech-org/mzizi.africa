import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { GeographyHistoryResponseDto } from "#/modules/geography/dto/geography-history-response.dto.ts";
import { geographyHistoryResponseExample } from "#/modules/geography/dto/geography-history-response.dto.example.ts";

/** Managed by Dryv: GeographyHistoryResponseDto enforces exactly what the GeographyHistoryResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(GeographyHistoryResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = geographyHistoryResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("GeographyHistoryResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(geographyHistoryResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...geographyHistoryResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});