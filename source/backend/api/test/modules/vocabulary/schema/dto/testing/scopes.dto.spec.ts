import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ScopesDto } from "#/modules/vocabulary/schema/dto/scopes.dto.ts";
import { scopesExample } from "@test/modules/vocabulary/schema/dto/examples/scopes.dto.example.ts";

/** Managed by Dryv: ScopesDto enforces exactly what the Scopes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ScopesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = scopesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ScopesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(scopesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...scopesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
