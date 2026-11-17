import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedSubjectEntityDto } from "#/modules/shared/schema/dto/coded-subject-entity.dto.ts";
import { codedSubjectEntityExample } from "@test/modules/shared/schema/dto/examples/coded-subject-entity.dto.example.ts";

/** Managed by Dryv: CodedSubjectEntityDto enforces exactly what the CodedSubjectEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedSubjectEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedSubjectEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodedSubjectEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedSubjectEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...codedSubjectEntityExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
