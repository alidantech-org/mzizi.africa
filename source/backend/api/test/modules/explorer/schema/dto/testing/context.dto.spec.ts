import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ContextDto } from "#/modules/explorer/schema/dto/context.dto.ts";
import { contextExample } from "@test/modules/explorer/schema/dto/examples/context.dto.example.ts";

/** Managed by Dryv: ContextDto enforces exactly what the Context contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ContextDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = contextExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ContextDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(contextExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...contextExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
