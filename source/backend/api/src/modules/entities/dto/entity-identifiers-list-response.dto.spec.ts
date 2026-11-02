import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EntityIdentifiersListResponseDto } from "#/modules/entities/dto/entity-identifiers-list-response.dto.ts";
import { entityIdentifiersListResponseExample } from "#/modules/entities/dto/entity-identifiers-list-response.dto.example.ts";

/** Managed by Dryv: EntityIdentifiersListResponseDto enforces exactly what the EntityIdentifiersListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EntityIdentifiersListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = entityIdentifiersListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EntityIdentifiersListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(entityIdentifiersListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...entityIdentifiersListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});