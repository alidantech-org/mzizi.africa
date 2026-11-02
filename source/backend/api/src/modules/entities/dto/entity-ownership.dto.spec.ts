import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityOwnershipDto } from "#/modules/entities/dto/entity-ownership.dto.ts";
import { entityOwnershipExample } from "#/modules/entities/dto/entity-ownership.dto.example.ts";

/** Managed by Dryv: EntityOwnershipDto enforces exactly what the EntityOwnership contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityOwnershipDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityOwnershipExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityOwnershipDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityOwnershipExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityOwnershipExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});