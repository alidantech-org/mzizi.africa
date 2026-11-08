import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumQuestionDto } from "#/modules/elections/dto/referendum-question.dto.ts";
import { referendumQuestionExample } from "#/modules/elections/dto/referendum-question.dto.example.ts";

/** Managed by Dryv: ReferendumQuestionDto enforces exactly what the ReferendumQuestion contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumQuestionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumQuestionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumQuestionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumQuestionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumQuestionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});