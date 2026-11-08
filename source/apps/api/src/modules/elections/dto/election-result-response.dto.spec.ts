import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionResultResponseDto } from "#/modules/elections/dto/election-result-response.dto.ts";
import { electionResultResponseExample } from "#/modules/elections/dto/election-result-response.dto.example.ts";

/** Managed by Dryv: ElectionResultResponseDto enforces exactly what the ElectionResultResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionResultResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionResultResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionResultResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionResultResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionResultResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});