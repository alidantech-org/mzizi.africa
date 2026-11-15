import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodedCreatedDto } from "#/modules/shared/dto/coded-created.dto.ts";
import { codedCreatedExample } from "#/modules/shared/dto/coded-created.dto.example.ts";

/** Managed by Dryv: CodedCreatedDto enforces exactly what the CodedCreated contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodedCreatedDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codedCreatedExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("CodedCreatedDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codedCreatedExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codedCreatedExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});