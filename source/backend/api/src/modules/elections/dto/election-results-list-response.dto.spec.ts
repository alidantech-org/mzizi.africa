import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionResultsListResponseDto } from "#/modules/elections/dto/election-results-list-response.dto.ts";
import { electionResultsListResponseExample } from "#/modules/elections/dto/election-results-list-response.dto.example.ts";

/** Managed by Dryv: ElectionResultsListResponseDto enforces exactly what the ElectionResultsListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionResultsListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionResultsListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionResultsListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionResultsListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionResultsListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});