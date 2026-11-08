import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionResultListQueryDto } from "#/modules/elections/dto/election-result-list-query.dto.ts";
import { electionResultListQueryExample } from "#/modules/elections/dto/election-result-list-query.dto.example.ts";

/** Managed by Dryv: ElectionResultListQueryDto enforces exactly what the ElectionResultListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionResultListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionResultListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionResultListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionResultListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionResultListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});