import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CompositionsDto } from "#/modules/economy/schema/dto/compositions.dto.ts";
import { compositionsExample } from "@test/modules/economy/schema/dto/examples/compositions.dto.example.ts";

/** Managed by Dryv: CompositionsDto enforces exactly what the Compositions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CompositionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = compositionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CompositionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(compositionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...compositionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
