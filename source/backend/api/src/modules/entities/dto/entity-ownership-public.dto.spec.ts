import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityOwnershipPublicDto } from "#/modules/entities/dto/entity-ownership-public.dto.ts";
import { entityOwnershipPublicExample } from "#/modules/entities/dto/entity-ownership-public.dto.example.ts";

/** Managed by Dryv: EntityOwnershipPublicDto enforces exactly what the EntityOwnershipPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityOwnershipPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityOwnershipPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityOwnershipPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityOwnershipPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityOwnershipPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});