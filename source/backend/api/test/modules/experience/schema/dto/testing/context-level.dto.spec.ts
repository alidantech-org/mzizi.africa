import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContextLevelDto } from "#/modules/experience/schema/dto/context-level.dto.ts";
import { contextLevelExample } from "@test/modules/experience/schema/dto/examples/context-level.dto.example.ts";

/** Managed by Dryv: ContextLevelDto enforces exactly what the ContextLevel contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContextLevelDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contextLevelExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContextLevelDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contextLevelExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contextLevelExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
