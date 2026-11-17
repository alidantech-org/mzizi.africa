import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedPeriodSubjectEntityDto } from "#/modules/shared/schema/dto/coded-period-subject-entity.dto.ts";
import { codedPeriodSubjectEntityExample } from "@test/modules/shared/schema/dto/examples/coded-period-subject-entity.dto.example.ts";

/** Managed by Dryv: CodedPeriodSubjectEntityDto enforces exactly what the CodedPeriodSubjectEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedPeriodSubjectEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedPeriodSubjectEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodedPeriodSubjectEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedPeriodSubjectEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...codedPeriodSubjectEntityExample.valid(),
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
