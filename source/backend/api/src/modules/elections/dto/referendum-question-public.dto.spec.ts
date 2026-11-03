import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ReferendumQuestionPublicDto } from "#/modules/elections/dto/referendum-question-public.dto.ts";
import { referendumQuestionPublicExample } from "#/modules/elections/dto/referendum-question-public.dto.example.ts";

/** Managed by Dryv: ReferendumQuestionPublicDto enforces exactly what the ReferendumQuestionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ReferendumQuestionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = referendumQuestionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ReferendumQuestionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(referendumQuestionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...referendumQuestionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});