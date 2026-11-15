import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedEntityDto } from "#/modules/shared/schema/dto/coded-entity.dto.ts";
import { codedEntityExample } from "#/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** Managed by Dryv: CodedEntityDto enforces exactly what the CodedEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedEntityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CodedEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codedEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});