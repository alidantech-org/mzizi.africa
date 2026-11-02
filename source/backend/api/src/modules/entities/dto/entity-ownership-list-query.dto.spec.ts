import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityOwnershipListQueryDto } from "#/modules/entities/dto/entity-ownership-list-query.dto.ts";
import { entityOwnershipListQueryExample } from "#/modules/entities/dto/entity-ownership-list-query.dto.example.ts";

/** Managed by Dryv: EntityOwnershipListQueryDto enforces exactly what the EntityOwnershipListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityOwnershipListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityOwnershipListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityOwnershipListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityOwnershipListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityOwnershipListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});