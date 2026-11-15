import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedValidityEntityDto } from "#/modules/shared/dto/coded-validity-entity.dto.ts";
import { codedValidityEntityExample } from "#/modules/shared/dto/coded-validity-entity.dto.example.ts";

/** Managed by Dryv: CodedValidityEntityDto enforces exactly what the CodedValidityEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedValidityEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedValidityEntityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CodedValidityEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedValidityEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codedValidityEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});