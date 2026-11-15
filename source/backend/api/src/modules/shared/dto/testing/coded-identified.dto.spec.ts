import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedIdentifiedDto } from "#/modules/shared/dto/coded-identified.dto.ts";
import { codedIdentifiedExample } from "#/modules/shared/dto/examples/coded-identified.dto.example.ts";

/** Managed by Dryv: CodedIdentifiedDto enforces exactly what the CodedIdentified contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedIdentifiedDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedIdentifiedExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CodedIdentifiedDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedIdentifiedExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codedIdentifiedExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});