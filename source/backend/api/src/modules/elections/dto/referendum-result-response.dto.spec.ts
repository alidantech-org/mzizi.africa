import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumResultResponseDto } from "#/modules/elections/dto/referendum-result-response.dto.ts";
import { referendumResultResponseExample } from "#/modules/elections/dto/referendum-result-response.dto.example.ts";

/** Managed by Dryv: ReferendumResultResponseDto enforces exactly what the ReferendumResultResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumResultResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumResultResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumResultResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumResultResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumResultResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});