import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ImmutableDto } from "#/modules/shared/dto/immutable.dto.ts";
import { immutableExample } from "#/modules/shared/dto/examples/immutable.dto.example.ts";

/** Managed by Dryv: ImmutableDto enforces exactly what the Immutable contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ImmutableDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = immutableExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ImmutableDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(immutableExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...immutableExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});