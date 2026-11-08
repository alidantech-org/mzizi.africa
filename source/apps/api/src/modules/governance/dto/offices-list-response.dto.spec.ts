import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OfficesListResponseDto } from "#/modules/governance/dto/offices-list-response.dto.ts";
import { officesListResponseExample } from "#/modules/governance/dto/offices-list-response.dto.example.ts";

/** Managed by Dryv: OfficesListResponseDto enforces exactly what the OfficesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OfficesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = officesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("OfficesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(officesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...officesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});