import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionsListResponseDto } from "#/modules/elections/dto/elections-list-response.dto.ts";
import { electionsListResponseExample } from "#/modules/elections/dto/elections-list-response.dto.example.ts";

/** Managed by Dryv: ElectionsListResponseDto enforces exactly what the ElectionsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});