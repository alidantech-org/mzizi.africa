import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DerivationsDto } from "#/modules/source/schema/dto/derivations.dto.ts";
import { derivationsExample } from "@test/modules/source/schema/dto/examples/derivations.dto.example.ts";

/** Managed by Dryv: DerivationsDto enforces exactly what the Derivations contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DerivationsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = derivationsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DerivationsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(derivationsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...derivationsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
