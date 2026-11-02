import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityLocationPublicDto } from "#/modules/entities/dto/entity-location-public.dto.ts";
import { entityLocationPublicExample } from "#/modules/entities/dto/entity-location-public.dto.example.ts";

/** Managed by Dryv: EntityLocationPublicDto enforces exactly what the EntityLocationPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityLocationPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityLocationPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityLocationPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityLocationPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityLocationPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});