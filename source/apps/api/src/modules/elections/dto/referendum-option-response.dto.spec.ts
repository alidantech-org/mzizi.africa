import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumOptionResponseDto } from "#/modules/elections/dto/referendum-option-response.dto.ts";
import { referendumOptionResponseExample } from "#/modules/elections/dto/referendum-option-response.dto.example.ts";

/** Managed by Dryv: ReferendumOptionResponseDto enforces exactly what the ReferendumOptionResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumOptionResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumOptionResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumOptionResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumOptionResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumOptionResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});