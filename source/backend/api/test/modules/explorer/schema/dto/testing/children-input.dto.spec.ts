import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildrenInputDto } from "#/modules/explorer/schema/dto/children-input.dto.ts";
import { childrenInputExample } from "@test/modules/explorer/schema/dto/examples/children-input.dto.example.ts";

/** Managed by Dryv: ChildrenInputDto enforces exactly what the ChildrenInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildrenInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childrenInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildrenInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childrenInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...childrenInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
