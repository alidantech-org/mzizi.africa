import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContextInputDto } from "#/modules/experience/schema/dto/context-input.dto.ts";
import { contextInputExample } from "@test/modules/experience/schema/dto/examples/context-input.dto.example.ts";

/** Managed by Dryv: ContextInputDto enforces exactly what the ContextInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContextInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contextInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContextInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contextInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contextInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
