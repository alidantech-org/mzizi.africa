import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidatesListResponseDto } from "#/modules/elections/dto/candidates-list-response.dto.ts";
import { candidatesListResponseExample } from "#/modules/elections/dto/candidates-list-response.dto.example.ts";

/** Managed by Dryv: CandidatesListResponseDto enforces exactly what the CandidatesListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidatesListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidatesListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidatesListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidatesListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidatesListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});