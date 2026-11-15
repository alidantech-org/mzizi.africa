import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntitiesDto } from "#/modules/official/schema/dto/entities.dto.ts";
import { entitiesExample } from "#/modules/official/schema/dto/examples/entities.dto.example.ts";

/** Managed by Dryv: EntitiesDto enforces exactly what the Entities contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntitiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entitiesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntitiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entitiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entitiesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});