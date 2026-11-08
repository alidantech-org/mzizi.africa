import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectoratesListResponseDto } from "#/modules/elections/dto/electorates-list-response.dto.ts";
import { electoratesListResponseExample } from "#/modules/elections/dto/electorates-list-response.dto.example.ts";

/** Managed by Dryv: ElectoratesListResponseDto enforces exactly what the ElectoratesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectoratesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electoratesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectoratesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electoratesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electoratesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});