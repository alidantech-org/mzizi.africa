import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChildWindowDto } from "#/modules/geography/schema/dto/child-window.dto.ts";
import { childWindowExample } from "@test/modules/geography/schema/dto/examples/child-window.dto.example.ts";

/** Managed by Dryv: ChildWindowDto enforces exactly what the ChildWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChildWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = childWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ChildWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(childWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...childWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
