import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityDto } from "#/modules/shared/schema/dto/entity.dto.ts";
import { entityExample } from "#/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** Managed by Dryv: EntityDto enforces exactly what the Entity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});