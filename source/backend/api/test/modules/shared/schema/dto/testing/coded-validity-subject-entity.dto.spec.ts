import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedValiditySubjectEntityDto } from "#/modules/shared/schema/dto/coded-validity-subject-entity.dto.ts";
import { codedValiditySubjectEntityExample } from "@test/modules/shared/schema/dto/examples/coded-validity-subject-entity.dto.example.ts";

/** Managed by Dryv: CodedValiditySubjectEntityDto enforces exactly what the CodedValiditySubjectEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedValiditySubjectEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedValiditySubjectEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodedValiditySubjectEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedValiditySubjectEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...codedValiditySubjectEntityExample.valid(),
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
