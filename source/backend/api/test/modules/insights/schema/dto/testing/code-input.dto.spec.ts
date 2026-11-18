import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto.ts";
import { codeInputExample } from "@test/modules/insights/schema/dto/examples/code-input.dto.example.ts";

/** Managed by Dryv: CodeInputDto enforces exactly what the CodeInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CodeInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = codeInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CodeInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(codeInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...codeInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
