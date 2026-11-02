import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityLocationListQueryDto } from "#/modules/entities/dto/entity-location-list-query.dto.ts";
import { entityLocationListQueryExample } from "#/modules/entities/dto/entity-location-list-query.dto.example.ts";

/** Managed by Dryv: EntityLocationListQueryDto enforces exactly what the EntityLocationListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityLocationListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityLocationListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityLocationListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityLocationListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityLocationListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});