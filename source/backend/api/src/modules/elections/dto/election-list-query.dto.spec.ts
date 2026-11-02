import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ElectionListQueryDto } from "#/modules/elections/dto/election-list-query.dto.ts";
import { electionListQueryExample } from "#/modules/elections/dto/election-list-query.dto.example.ts";

/** Managed by Dryv: ElectionListQueryDto enforces exactly what the ElectionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ElectionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = electionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ElectionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(electionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...electionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});