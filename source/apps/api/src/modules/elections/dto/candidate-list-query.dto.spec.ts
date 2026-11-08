import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CandidateListQueryDto } from "#/modules/elections/dto/candidate-list-query.dto.ts";
import { candidateListQueryExample } from "#/modules/elections/dto/candidate-list-query.dto.example.ts";

/** Managed by Dryv: CandidateListQueryDto enforces exactly what the CandidateListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CandidateListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = candidateListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CandidateListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(candidateListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...candidateListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});