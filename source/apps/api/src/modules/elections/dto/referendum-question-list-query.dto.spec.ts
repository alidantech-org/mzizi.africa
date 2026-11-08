import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumQuestionListQueryDto } from "#/modules/elections/dto/referendum-question-list-query.dto.ts";
import { referendumQuestionListQueryExample } from "#/modules/elections/dto/referendum-question-list-query.dto.example.ts";

/** Managed by Dryv: ReferendumQuestionListQueryDto enforces exactly what the ReferendumQuestionListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumQuestionListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumQuestionListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumQuestionListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumQuestionListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumQuestionListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});