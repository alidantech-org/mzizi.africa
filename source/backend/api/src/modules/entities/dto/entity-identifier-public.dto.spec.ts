import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityIdentifierPublicDto } from "#/modules/entities/dto/entity-identifier-public.dto.ts";
import { entityIdentifierPublicExample } from "#/modules/entities/dto/entity-identifier-public.dto.example.ts";

/** Managed by Dryv: EntityIdentifierPublicDto enforces exactly what the EntityIdentifierPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityIdentifierPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityIdentifierPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityIdentifierPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityIdentifierPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityIdentifierPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});